import overlay from './overlay';
import Vue from 'vue';
export {overlay};
import {transitionEndEvent} from '../util';
const Mask = Vue.extend({
	data () {
		return {
			closed: true
		};
	},
	render (createElement) {
		let directives = [];
		directives.push({
			name: 'show',
			rawName: 'v-show',
			value: !this.closed,
			expression: '!closed'
		});
		return createElement('overlay', {
			directives,
			props: {
				lock: this.lock,
				position: this.position,
				resize: this.resize,
				ani: this.ani
			}
		});
	},
	methods: {
		destroy () {
			this.closed = true;
			if (this.ani && !this.$isServer) {
				this.$el.addEventListener(transitionEndEvent, this.doDestroy);
			} else {
				this.doDestroy();
			}
		},
		doDestroy () {
			if (this.$el) {
				this.$destroy();
				this.$el.parentNode.removeChild(this.$el);
			}
		}
	},
	components: {
		overlay
	}
});
/**
 * target 遮罩目标元素
 * lock 是否给 目标元素添加 overflow为hidden
 * position 是否强制设置 position 可以设置 absolute或者fixed
 * resize 是否绑定body的resize事件在body大小更新时更新组件大小
 * ani 是否需要动画 动画 是一  className 以overlay开始，遵循 vue动画规则
 */
export default function (opt) {
	if (!opt || !opt.target) {
		return;
	}
	if (Vue.prototype.$isServer) {
		return;
	}
	if (typeof opt.target === 'string') {
		opt.target = document.querySelector(opt.target);
	}
	let dom = document.createElement('div');

	// 不适用组件的动画
	let data = {
		lock: opt.lock,
		position: opt.position,
		resize: opt.resize,
		ani: opt.ani === undefined || opt.ani === null ? true : opt.ani
	};
	opt.target.appendChild(dom);
	let instance = new Mask({
		data
	});
	instance.$mount(dom);
	instance.closed = false;
	return instance;
};
