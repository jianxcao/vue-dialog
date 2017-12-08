import Vue from 'vue';
import install from './install';
import {isVnode, isId} from './util';
import {closeAll, dialogManager, conf} from './base';
/**
 * dialog
 * [配置参数]
	{
		title :	null,		[可选][string|null|vnode|vue组件] 对话框标题，若标题为空字符，则不显示标题栏（仍显示关闭按钮）；如果为null，则不显示标题栏也不显示关闭按钮；如果没有标题栏，则不能拖动
		content : "",		[必选][string|null|vnode|vue组件] 对话框内容
		titlePropsData: [必选][Object] 对话框title组件的数据
		contentPropsData [可选][Object] 对话框content组件的数据

		button : ["确定"],	[可选][字符串数组] 对话框按钮，若为空数组，则不显示按钮栏；如果按钮字符以*开头，则表示是默认按钮，但*不显示，默认按钮在打开时会被聚焦选中
		method : "append",	[可选][字符串] dom元素的插入位置，支持append和prepend两种情况，默认append
		position : "c", 可选，数字0~8、整数数组、坐标对象、字符示位
										定位对话框的位置，默认居中
										0 可用屏幕中央 1-8分别从屏幕左上角顺时针对应八个位置
										若为数组，则以该数组给定的xy坐标显示
										若为对象则当作定位样式处理，支持left、right、top、bottom属性，如果值是 auto/c/center 则居中显示，比如 left:"auto" 则左右居中
		若为字符，则可以处理 t l r b c 字符的任何合理组合
		width : 0,		[可选][数字|字符串] 对话框宽度，数字以px为单位， 若为0，则跟随内容宽度自适应（无最小宽度限制）
		height : 0,			[可选][数字|字符串] 对话框高度，数字以px为单位， 若为0，则跟随内容高度自适应（主体部分保持最小50像素高度）

		css : "",			[可选][字符串|数组|object] 附加样式，该样式被添加到对框框最外层元素上
		cssObj: {},   [可选][object]可以自定义一些样式到最外围元素上，写在style上
		style:{}			[可选][object]可以自定义一些样式到最外围元素上，写在style上

		animate : 0,		[可选][数字] 动画类型 0无动画 1渐入 2切入 3缩小渐入(CSS3) 4旋转(CSS3) 5放大旋转(CSS3) 或者区分设置 13 / 14 / 15 / 23 / 24 / 25，也可以自定义CSS3样式
		layout : true,		[可选][布尔|数字] 是否显示蒙层，即打开类模式窗口（不是真正的模式窗口）0|false不显示 -1全透明 1|true半透明 2强制半透明
		timeout : 0,		[可选][数字] 是否自动关闭对话框，为0则不自动关闭，单位ms
	}
	事件
	beforeMount dialog 挂载前，同vue的beforeMount
	mounted dialog 挂载后，通vue得mounted
	show dialog显示时候调用，每次显示都会调用
	hide hide dialog隐藏时候调用
	btnClick [ret] dialog上的按钮点击的时候调用，返回参数有 ret标记，表明每个按钮点击时候调用的标记,
						ret 可以通过全局配置修改，自定义按钮携带 data-action='btn'的将会触发该事件data-ret可以自定义返回标志
	beforeClose dialog关闭前调用，任意一个返回false则会终止dialog关闭
	close dialog关闭前调用，这个时候dom还存在，但是关闭已经触发，无法返回了
	closed dialog 已经关闭啥都没有了，dom已经删除

	方法
	title(title : string|template|Vue componet)
	content(content: string|template|Vue componet)
	focusBtn() 使当前带*的按钮获取焦点
	show() 显示弹窗
	hide() 隐藏弹窗，弹窗还存在
	close() 关闭弹窗
	toString() 显示弹窗id
*/
export default function (Dialog) {
	function dialog (opt, callback) {
		// 啥都没有传递，销毁所有dialog
		// 关闭所有dialog
		if (!opt) {
			return closeAll();
		}
		// 传入一个Dialog实例直接关闭这个dialog
		if (opt instanceof Dialog) {
			return opt.close();
		}
		let t = typeof opt;
		if (t === 'string') {
			// 是一个id查找关闭这个dialog
			if (isId.test(opt)) {
				let instance = dialogManager.getInstance(opt);
				if (instance) {
					let ret = typeof callback === 'string' ? callback : undefined;
					return instance.close(ret);
				}
			} else {
				// 打开一个弹窗，只有content
				opt = {
					content: opt
				};
			}
		} else if (t === 'object') {
			if (isVnode(opt) || opt.template || opt.render || opt.super === Vue) {
				opt = {
					content: opt
				};
			}
		}
		if (typeof opt !== 'object') {
			return;
		}
		// 默认插入到文档最前面
		if (!opt.method) {
			opt.method = 'prepend';
		}
		// 处理style属性
		opt.stylesheet = ['style', 'cssObj'].reduce((result, key) => {
			let current = opt[key];
			if (current) {
				Array.isArray(current.concat) ? result = result.concat(current) : result.push(current);
				delete opt[key];
			}
			return result;
		}, []);
		// 处理css属性
		opt.css = ['class', 'className', 'classname', 'css'].reduce((result, key) => {
			let current = opt[key];
			if (current) {
				Array.isArray(current.concat) ? result = result.concat(current) : result.push(current);
				delete opt[key];
			}
			return result;
		}, []);

		var container = document.createElement('div');
		if (opt.method === 'prepend') {
			document.body.insertBefore(container, document.body.firstChild);
		} else {
			document.body.appendChild(container);
		}
		delete opt.method;
		var dialogInstance = new Dialog({
			created () {
				this._title = opt.title;
				this._content = opt.content || '';
			},
			propsData: opt
		});
		if (callback && typeof callback === 'function') {
			dialogInstance.$once('closed', callback);
		}
		window.setTimeout(function () {
			dialogInstance.$mount(container);
		}, 0);
		return dialogInstance;
	};

	dialog.alert = function alert (content, btn, callback) {
		return info(content, btn, callback, 0, 'es-dialog-alert');
	};
	dialog.confirm = function confirm (content, btn, callback) {
		return info(content, btn, callback, ['取消', '*确定'], 'es-dialog-confirm');
	};
	dialog.error = function error (content, btn, callback) {
		return info(content, btn, callback, 0, 'es-dialog-error');
	};
	dialog.toast = function toast (content, timeout, callback) {
		if (typeof timeout === 'function') {
			callback = timeout;
			timeout = 0;
		}
		return dialog({
			title: null,
			css: 'es-dialog-toast',
			content: content,
			button: [],
			layout: -1,
			position: {
				bottom: '30%'
			},
			timeout: timeout || 2500,
			animate: 6
		}, callback);
	};
	const info = function (content, btn, callback, _defaultBtn, _defaultCss) {
		if (typeof btn === 'function') {
			callback = btn;
			btn = 0;
		}
		var button = btn || _defaultBtn || ['*确定'];
		return dialog({
			title: null,
			css: _defaultCss || 'es-dialog-info',
			content: content,
			dragable: 2,
			button: button
		}, callback);
	};
	dialog.info = info;
	// 挂接插件安装方法
	dialog.install = install(dialog, Dialog);

	// 使用插件
	Vue.use(dialog);
	dialog.conf = conf;
	// 挂接到方法上
	dialog.closeAll = dialog.destroyAll = closeAll;
	return dialog;
};

