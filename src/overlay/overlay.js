/**
 * 产生一个遮罩层
 */
/* eslint-disable */
import {isIOS} from '../util';
import './overlay.less';
/* eslint-enable */
/**
 * props
 * style 控制样式
 * class 自定义class
 * :lock 是否锁定 锁定后会加overflow:hidden
 * :position 强制修改position属性，因为会自动调整，设置style的不管用，只能通过这个设置
 * :resize 设置成true将会在window大小发生变化的时候更新窗口的大小
 * :ani ani 是否需要动画 动画 是一  className 以overlay开始，遵循 vue动画规则
 * 事件
 * update 大小发生改变的时候触发
 * v-show 控制显示隐藏
 * 如 会在其父元素元素上放一个遮罩, 如果父元素的 position属性是 static，
 * 则会修改成relative，如果是根组件，底层元素是body则修改蒙层得position为fixed。
 * <overlay v-bind:lock='true' class='test' style='test' v-show='true'>
 *
 */
export default {
	name: 'overlay',
	props: {
		//  是否给容器元素添加 overflow:hidden和height固定值
		lock: {
			type: Boolean,
			default: false
		},
		//  postion属性的值默认是fixed
		position: {
			type: String,
			default: 'fixed'
		},
		// 是否启用resize时修改  蒙层大小
		resize: {
			type: Boolean,
			default: false
		},
		// 内部动画是否触发
		ani: {
			type: Boolean,
			default: true
		},
		// 是否强制插入到body中，否则会
		fullScreen: {
			type: Boolean,
			default: false
		},
		// ios下锁定页面的高度
		lockIosHeight: {
			type: Boolean,
			default: false
		}
	},
	data () {
		return {
			bodyContainer: false
		};
	},
	watch: {
		resize: function (val, oldVal) {
			if (val) {
				window.addEventListener('resize', this.bodyResize);
			} else {
				window.removeEventListener('resize', this.bodyResize);
			}
		},
		position: function () {
			this.update();
		},
		lock: function () {
			this.update();
		},
		bodyContainer: function () {
			this.update();
		}
	},
	mounted () {
		let ele;
		let $ele = this.$el;
		if (this.fullScreen) {
			ele = document.body;
		} else {
			ele = $ele.parentNode;
			while (ele && ele !== document.body && ele.nodeType !== 1) {
				ele = ele.parentNode;
			}
		}
		//  采用方法调用可能传递的target是body
		if (ele === document.body) {
			this.bodyContainer = true;
		}
		let style = ele.style;
		if (this.bodyContainer) {
			this._holderDiv = document.createElement('div');
			document.body.insertBefore(this._holderDiv, document.body.firstChild);
			this._originScrollTop = document.body.scrollTop;
		}
		// 记录原来得属性，后面还得改回去
		this._originOverflow = style.overflow;
		this._originPos = style.position;
		this._originHeight = style.height;
		this._lockParentEle = ele;
		if (this.resize) {
			window.addEventListener('resize', this.bodyResize);
		}
		this.update();
	},
	destroyed () {
		// 销毁注销事件
		if (this._lockParentEle) {
			let style = this._lockParentEle.style;
			style.overflow = this._originOverflow;
			style.position = this._originPos;
			if (this._holderDiv) {
				document.body.removeChild(this._holderDiv);
			}
			if (this.bodyContainer && this.lock) {
				document.documentElement.style.overflow = this._originOverflow;
				if (isIOS) {
					style.height = this._originHeight;
					document.documentElement.style.height = this._originHeight;
					document.body.scrollTop = this._originScrollTop;
					document.body.removeClass('body-overflow');
				}
			}
			this._lockParentEle = null;
			this._originOverflow = null;
			this._originPos = null;
			this._originHeight = null;
			this._originScrollTop = null;
			if (this.resize) {
				window.removeEventListener('resize', this.bodyResize);
			}
		}
	},
	render (createElement) {
		// this.position用户传递过来得position
		// 如果用户设置了，程序就不会自动切换了
		let directives = [];
		// 更新位置显示出来
		// 第一次更新无效，因为组件还米有挂载好，挂在后执行才有效果
		let child = createElement('div', {
			class: 'layout mask',
			directives
		}, [this.$slots.default]);
		// 如果有动画，带transition标签
		if (this.ani) {
			return createElement('transition', {
				props: {
					name: 'overlay-animate'
				}
			}, [child]);
		}
		return child;
	},
	methods: {
		// 主动设置遮罩的大小
		// 只能是大于0的数字
		maskSize (width, height) {
			width = +width;
			height = +height;
			var $el = this.$el;
			// 自动计算
			if (!width >= 0 && !height >= 0) {
				if (this._lockParentEle) {
					if (this.bodyContainer) {
						if (this.lockIosHeight) {
							height = Math.max(window.innerHeight, document.body.clientHeight);
							width = Math.max(window.innerWidth, document.body.clientWidth);
						} else {
							height = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight, window.innerHeight);
							width = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth, window.innerWidth);
						}
					} else {
						let info = this._lockParentEle.getBoundingClientRect();
						height = info.height;
						width = info.width;
					}
				}
			}
			if (width >= 0) {
				$el.style.width = width + 'px';
			}
			if (height >= 0) {
				$el.style.height = height + 'px';
			}
			if (this.bodyContainer && this.lockIosHeight) {
				Object.assign($el.style, {
					top: document.body.scrollTop + 'px',
					left: document.body.scrollLeft + 'px'
				});
			}
			return this;
		},
		// 更新位置
		update () {
			let $ele = this.$el;
			var setPos = this.position;
			let ele = this._lockParentEle;
			if (!ele) {
				return this;
			}
			let style = ele.style;
			// 如果是锁定模式
			if (this.lock) {
				style.overflow = 'hidden';
				// 是body
				if (this.bodyContainer) {
					document.documentElement.style.overflow = 'hidden';
					if (isIOS && this.lock && this.lockIosHeight) {
						let h = window.innerHeight + 'px';
						document.documentElement.style.height = h;
						document.body.style.height = h;
						document.body.addClass('body-overflow');
						document.body.style.webkitOverflowScrolling = 'auto';
						let w = `-${this._originScrollTop}px`;
						document.body.scrollTop = 0;
						Object.assign(this._holderDiv.style, {
							marginTop: w
						});
					}
				}
			} else {
				style.overflow = this._originOverflow;
				if (this.bodyContainer) {
					document.documentElement.style.overflow = this._originOverflow;
					if (isIOS && this.lock && this.lockIosHeight) {
						this._holderDiv.style = '';
						document.body.style.height = this._originHeight;
						document.documentElement.style.height = this._originHeight;
						document.body.removeClass('body-overflow');
					}
				}
			}
			// 如果不是body元素，并且元素不是相对定位，或者绝对定位，则改成相对定位
			if (!this.bodyContainer) {
				let {position} = window.getComputedStyle(ele);
				if (position === 'static') {
					style.position = 'relative';
				}
			}
			$ele.style.position = setPos;
			if (setPos === 'absolute') {
				this.maskSize();
			}
			// 每次样式改变触发下
			this.$emit('update');
			return this;
		},
		// body大小发生变化的情况下
		bodyResize () {
			// 移动端设备下必须延迟时间否则会取不到正确得高度
			if (this._resizeTime) {
				window.clearTimeout(this._resizeTime);
			}
			this._resizeTime = window.setTimeout(() => {
				this.maskSize();
			}, 350);
		}
	}
};
