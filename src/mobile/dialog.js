/**
 * wap版本dialog
 */
import {base, dialogManager} from '../base';
import Vue from 'vue';
import main from '../main';
import {isIOS} from '../util';
import './index.less';

// focus重新定位
const focus = function (e) {
};

// 失去焦点
const blur = function (e) {
	// 强制从新设置位置
	// this.setPosition(true);
};
const fix = function () {
	let el = this.$el;
	let inputs = el.querySelectorAll('input,textarea');
	if (!inputs || !inputs.length) {
		return;
	}
	// 是ios就锁定
	this.maskPos = 'absolute';
	this.dialogPos = 'absolute';
	this.lock = true;
	this.$nextTick(function () {
		this.setPosition(true);
	});
	let l = inputs.length;
	for (let i = 0; i < l; i++) {
		let cur = inputs[i];
		//  防止相同内容插入，所以做个解除操作
		cur.removeEventListener('focus', this.__evt_focus);
		cur.addEventListener('focus', this.__evt_focus);

		// 失去焦点
		cur.removeEventListener('blur', this.__evt_blur);
		cur.addEventListener('blur', this.__evt_blur);
	}
};
const Dialog = Vue.extend({
	props: {
		width: {
			default: '22.91rem'
		}
	},
	watch: {
		titleData () {
			isIOS && fix.call(this);
		},
		contentData () {
			isIOS && fix.call(this);
		}
	},
	mounted: function () {
		this.__evt_focus = focus.bind(this);
		this.__evt_blur = blur.bind(this);
		//  ios下没有键盘弹起没有resize事件，只能用focus从新滚动，滚动条定位
		//  ios下如果有弹窗的修复
		if (isIOS) {
			this.$on('changeTitle', fix);
			this.$on('changeContent', fix);
			fix.call(this);
		}
	},
	mixins: [base]
});
// 生成dialog调用方法
const dialog = main(Dialog);
// 覆盖main中得toast
dialog.toast = function (content, timeout, callback) {
	if (typeof timeout === 'function') {
		callback = timeout;
		timeout = 0;
	}
	return dialog({
		title: null,
		css: 'es-dialog-toast',
		content: content,
		button: [],
		timeout: timeout || 2500,
		animate: 0
	}, callback);
};
// 导出dialog调用方法
export default dialog;
// 导出 alert方法
export const alert = dialog.alert;
// 导出toast方法
export const toast = dialog.toast;
// 导出 conf方法
export const confirm = dialog.confirm;
//  info方法
export const info = dialog.info;
//  error方法
export const error = dialog.error;
// 导出 dialog全局配置方法
export const conf = dialog.conf;

const rePosition = function (ele) {
	let scrollTop = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
	let winHeight = window.innerHeight;
	// bottom表示元素距离页面上部的距离
	let pos = ele.getBoundingClientRect();
	let isFixed = this.dialogPos === 'fixed';
	let h = isFixed ? pos.bottom : pos.bottom + scrollTop;
	// 键盘打开高度却没有变化, 说明计算出错
	// top小于0表示有部分弹窗在浏览器上面，bottom等于0表示有一部分弹窗在浏览器下面
	// h小于0表示整个input在浏览器的上面
	if (pos.top < 0 || h > winHeight || h < 0) {
		// 不是fixed，android建议用fixed就不走这个逻辑，用了absolute就会走
		// ios 即使是 fixed，键盘弹出也会变成absolute
		if (!isFixed && !isIOS) {
			ele.scrollIntoView();
		} else {
			let dialog = this.$refs.dialog;
			let s = window.getComputedStyle(ele);
			// 有人已经设置过bottom
			let top = +(s.top || '').replace('px', '') || 0;
			// 增加top让input露出来
			if (pos.top < 0) {
				top = top + Math.abs(pos.top) - ele.offsetTop;
			} else {
				top = -(top + h - winHeight) - ele.offsetTop;
			}
			dialog.style.top = top + 'px';
		}
	}
};
// 绑定resize事件去判断位置的变化
// 主要处理屏幕旋转，或者屏幕大小发生改变
(function () {
	var timer;
	const reset = function () {
		// 如果有获得焦点的元素，说明键盘是打开的
		// 存在一种情况，有input获得焦点，在弹窗内，但是获得焦点后从新定位，
		// 弹窗太大，有部分在外面，刚好input也在外面的部分里面
		// 这种情况一般发生在屏幕旋转，或者androi下的键盘谈起，ios键盘谈起没有作用
		let dialog = this.$refs.dialog;
		// 组件没有挂在，或者组件要销毁了
		if (!dialog || this._isBeingDestroyed || this._isDestroyed || !this._isMounted) {
			return;
		}
		// 取到当前焦点元素, 必须是一个input或者textArea，或者select
		let ele = document.activeElement;
		let isActiveElement = ele && /input|textarea|select/i.test(ele.tagName);
		if (!isActiveElement) {
			return;
		}
		// 获取所有dialog中得input-- 没有就证明可能是 非模式弹窗页面上的元素获得焦点
		let inputs = dialog.querySelectorAll('input,textarea');
		if (!inputs || !inputs.length) {
			return;
		}
		let status = false;
		let l = inputs.length;
		for (let i = 0; i < l; i++) {
			if (inputs[i] === ele) {
				status = true;
				break;
			}
		}
		// 没有status，说明弹窗内得input没有获得焦点
		if (!status) {
			return;
		}
		rePosition.call(this, ele);
	};
	const resize = function () {
		if (timer) {
			window.clearTimeout(timer);
		}
		timer = window.setTimeout(function () {
			let result = dialogManager.getAllInstance();
			result.forEach(function (current) {
				current.setPosition(true);
				reset.call(current);
			});
		}, 200);
	};
	window.addEventListener('resize', resize);
})();
