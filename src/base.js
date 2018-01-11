/**
 * 整个dialog对象
 * pc 和 wap公用的部分
 */
import manager from './poperManager';
import Vue from 'vue';
import {isVnode, isVueComponent, isHaveRootEle, transitionEndEvent, isPlainObject, toArray, isIE, getTransitionInfo} from './util';
import {overlay} from './overlay';
const dialogManager = manager();
const guid = (start => () => start++)(0);
const startWidthStar = /^\*.+/;
const isNumber = /^\d+$/;
// dialog全局配置
const globalConf = {
	// 单字符样式映射
	btnCssMap: {
		def: 'es-dialog-btn',
		'*': 'es-dialog-focus-btn'
	},
	// 按钮retId编码方法
	getBtnRetId: function (i, n) {
		// n > 1 ? n - i - 1 : 1
		return n > 1 ? i : 1;
	}
};
// 根据宽高计算对话框坐标
const	posReg = {
	l: /l/i,
	t: /t/i,
	r: /r/i,
	b: /b/i,
	c: /c/i
};
// 检测输如 position的合法性
const checkPosition = (function () {
	const checkPos = /(^[lcr][tcb]$)|(^[tcb][lcr]$)|(^[tcblr]$)/;
	const posKeys = ['left', 'top', 'bottom', 'right', 'marginTop', 'marginLeft'];
	return val => {
		let t = typeof val;
		if (t === 'function') {
			return true;
		}
		if (isPlainObject(val)) {
			return posKeys.some(cur => cur !== undefined && cur !== null);
		} else if (Array.isArray(val)) {
			return val.length === 2 && val[0] !== undefined && val[1] !== undefined;
		} else if (t === 'number') {
			return val >= 0 && val <= 8;
		} else if (t === 'string') {
			return checkPos.test(val);
		}
		return false;
	};
})();
const prepareComponent = function (content, ref, instances) {
	// 已经是vnode直接返回
	if (isVnode(content)) {
		return content;
	} else {
		let name = `${instances.id}-${ref}`;
		let t = typeof content;
		if (t === 'string' || t === 'number') {
			if (!isHaveRootEle(content)) {
				content = {
					name,
					template: ['<div>', content, '</div>'].join('')
				};
			} else {
				content = {
					name,
					template: content + ''
				};
			}
		}
		let mixin = {
			beforeCreate () {
				instances['$' + ref] = this;
			},
			data () {
				return {
					[ref + 'Data']: instances[ref + 'Data'],
					dialogData: instances[ref + 'Data']
				};
			}
		};
		let component;
		if (isVueComponent(content)) {
			component = content.extend({
				mixins: [mixin]
			});
			if (!component.options.name) {
				component.options.name = name;
			}
		} else {
			if (content._Ctor) {
				component = Vue.extend(content).extend({
					mixins: [mixin]
				});
			} else {
				component = Vue.extend(Object.assign({}, content));
				component.mixin(mixin);
			}
		}
		// 取到options上的data保存
		return component;
	}
};
// 创建vnode
const prepareVnode = function (component, propsData = {}, ref, createElement) {
	// 如果直接是vnode，则直接返回
	if (isVnode(component)) {
		return component;
	}
	// 没有就返回空节点
	if (!component) {
		return createElement('');
	}
	return createElement(component, {
		ref: ['$' + ref]
	});
};
// 渲染title
const renderHeader = function (createElement) {
	let title = this.title();
	// title 是null或者undefined则不渲染title
	if (title === undefined || title === null) {
		return createElement('');
	}
	// 渲染 title slot
	let titleNode = [this._t('title')];
	titleNode.push(prepareVnode(this._titleComponent, this.titleData, 'title', createElement));
	return createElement('div', {
		class: 'es-dialog-head m-dialog-head',
		ref: 'title'
	}, [
		// 主要内容区域
		createElement('h1', titleNode),
		// 关闭按钮
		createElement('a', {
			class: 'es-dialog-close m-dialog-close',
			attrs: {
				'hidefocus': 'true',
				'data-action': 'close'
			}
		}, [
		// 多放置一个em，主要是可以用em些x得样式，用a标签扩大点击位置
			createElement('em', ['\ue779'])
		])
	]);
};
// 渲染body
const renderBody = function (createElement) {
	return createElement('div', {
		class: 'es-dialog-body m-dialog-body'
	}, [
		createElement('div', {
			class: 'es-dialog-main m-dialog-main',
			ref: 'main'
		}, [
			// 不可以使用slots
			// this._t('content'),
			// this.$slots.default,
			prepareVnode(this._contentComponent, this.contentData, 'content', createElement)
		])
	]);
};
// 渲染body
const renderFooter = function (createElement) {
	let button = this.button;
	let l = button.length;
	let nodes = button.map((cur, index) => {
		let is = startWidthStar.test(cur);
		let cls = {};
		cls[globalConf.btnCssMap.def] = true;
		cls[globalConf.btnCssMap['*']] = is;
		return createElement('a', {
			class: cls,
			attrs: {
				'data-action': 'btn',
				'data-ret': globalConf.getBtnRetId(index, l),
				'href': 'javascript:void(0);'
			}
		}, [
			createElement('span', [is ? cur.slice(1) : cur])
		]);
	});
	return createElement('div', {
		class: 'm-dialog-footer es-dialog-footer',
		ref: 'footer'
	}, nodes);
};
// 修改className
const polymerCss = function (...args) {
	let css = this.css;
	let result = [];
	if (typeof css === 'string') {
		result = css.split(' ').map(cur => cur.trim());
	}
	if (Array.isArray(css)) {
		result = css.slice(0);
	} else if (isPlainObject(css)) {
		result = [css];
	}
	return result.concat(args);
};
/**
 * 处理样式
 */
const polymerStyle = function (defaultStyle) {
	let style = [];
	if (defaultStyle) {
		style.push(defaultStyle);
	}
	let stylesheet = this.stylesheet;
	if (isPlainObject(stylesheet) || typeof stylesheet === 'string') {
		style.push(stylesheet);
	} else if (Array.isArray(stylesheet)) {
		style = style.concat(stylesheet);
	}
	return style;
};
/**
 * 重设 width
 */
const callWidth = function () {
	// 正在销毁，或者没有挂在都直接返回
	if (this._isBeingDestroyed || this._isDestroyed || !this._isMounted) {
		return;
	}
	let dialogDom = this.$refs.dialog;
	// 整数的情况下认为是px为单位，如果是个字符串就认为是别的单位
	if (isNumber.test(this.width)) {
		let w = parseInt(this.width, 10);
		if (w === 0) {
			dialogDom.style.width = 'auto';
		} else if (w > 0) {
			dialogDom.style.width = w + 'px';
		}
	} else {
		dialogDom.style.width = this.width;
	}
};
/**
 * 重设 height
 */
const callHeight = function () {
	// 正在销毁，或者没有挂在都直接返回
	if (this._isBeingDestroyed || this._isDestroyed || !this._isMounted) {
		return;
	}
	let main = this.$refs.main;
	// 整数的情况下认为是px为单位，如果是个字符串就认为是别的单位
	if (isNumber.test(this.height)) {
		let w = parseInt(this.height, 10);
		if (w === 0) {
			main.style.height = 'auto';
		} else if (w > 0) {
			main.style.height = w + 'px';
		}
	} else {
		main.style.height = this.height;
	}
};
// 处理位置
const callPos = function () {
	// 正在销毁，或者没有挂在都直接返回
	if (this._isBeingDestroyed || this._isDestroyed || !this._isMounted) {
		return {};
	}
	// 当前是隐藏状态，不显示
	let pos = this.position;
	let dialogDom = this.$refs.dialog;
	let position = {};
	if (typeof pos === 'function') {
		position = pos.call(this);
		if (isPlainObject(position)) {
			position = Object.assign({
				left: '',
				top: '',
				bottom: '',
				right: '',
				marginTop: '',
				marginLeft: ''
			}, position);
			Object.assign(dialogDom.style, position);
		}
		return position;
	}
	let rect = dialogDom.getBoundingClientRect();
	// 没有宽度就不定位
	if (rect.width === 0) {
		return {};
	}
	let width = rect.width;
	let height = rect.height;
	let fixed = this.dialogPos === 'fixed';
	let	win = window;
	let	scrollFix = [
		Math.max(document.body.scrollLeft, document.documentElement.scrollLeft),
		Math.max(document.documentElement.scrollTop, document.body.scrollTop)];
		// left,top,right,bottom
	let	workArea = [0, 0, win.innerWidth, win.innerHeight];
		// 计算预置的X、Y坐标
	let	X = {
		left: (function () { /* 左 */
			return fixed ? {
				left: 0
			} : {
				left: workArea[0] + scrollFix[0] + 'px'
			};
		})(),
		center: (function () { /* 中 */
			return fixed ? {
				left: '50%',
				marginLeft: '-' + width / 2 + 'px'
			} : {
				left: Math.floor((workArea[2] + workArea[0] - width) / 2) + scrollFix[0] + 'px'
			};
		})(),
		right: (function () { /* 右 */
			return fixed ? {
				right: 0
			} : {
				left: (workArea[2] - width + scrollFix[0]) + 'px'
			};
		})()
	};
	let	Y = {
		top: (function () { /* 上 */
			return fixed ? {
				top: 0
			} : {
				top: workArea[1] + scrollFix[1] + 'px'
			};
		})(),
		center: (function () { /* 中 */
			let top = Math.floor((workArea[3] + workArea[1] - height) / 2) + scrollFix[1];
				// 溢出屏幕的距离
			let	overflowH = top < 0 ? Math.abs(top) : 0;
			return fixed ? {
				top: '50%',
				marginTop: '-' + (height / 2 - overflowH) + 'px'
			} : {
				top: overflowH ? 0 : top + 'px'
			};
		})(),
		bottom: (function () { /* 下 */
			return fixed ? {
				bottom: 0
			} : {
				top: Math.max(0, workArea[3] - height + scrollFix[1]) + 'px'
			};
		})()
	};
	// 按照配置类型进行分别计算
	switch (pos.constructor) {
	case String: // 检测配置，转化为数字类型处理
		var r = posReg;
		pos = pos.length === 1 ? pos + 'c' : pos;
		pos = r.t.test(pos) ? r.l.test(pos) ? 1 : r.r.test(pos) ? 3 : 2 :
			r.b.test(pos) ? r.l.test(pos) ? 7 : r.r.test(pos) ? 5 : 6 :
			r.c.test(pos) ? r.l.test(pos) ? 8 : r.r.test(pos) ? 4 : 0 : 0;
		// 没有break，为的是进入下个流程当作数字处理
	case Number:
		if (pos < 0 || pos > 8) {
			break;
		}
		// 计算预设的九个点
		var arr = [
			[X.center, Y.center],
			[X.left, Y.top],
			[X.center, Y.top],
			[X.right, Y.top],
			[X.right, Y.center],
			[X.right, Y.bottom],
			[X.center, Y.bottom],
			[X.left, Y.bottom],
			[X.left, Y.center]
		];
		// 将CSS配置扩展到一起
		position = Object.assign(position, arr[pos][0], arr[pos][1]);
		break;
	case Array:
		position.left = pos[0] === 0 ? 0 : (pos[0] || '');
		position.top = pos[1] === 0 ? 0 : (pos[1] || '');
		break;
	default: // 否则认为是自定义CSS对象
		position = Object.assign({}, pos || {});
		break;
	}
	// 删除无效的设置或默认的保留字
	['left', 'right', 'top', 'bottom'].forEach(function (key, i) {
		let val = position[key];
		let	keepValue = ['auto', 'c', 'center'];
		if (key in position && (val ? keepValue.indexOf(val) >= 0 : val !== 0)) {
			delete position[key];
		}
	});
	// 没有提供的位置信息，默认都居中处理
	if (!('left' in position) && !('right' in position)) {
		Object.assign(position, X.center);
	}
	if (!('top' in position) && !('bottom' in position)) {
		Object.assign(position, Y.center);
	}
	position = Object.assign({
		left: '',
		top: '',
		bottom: '',
		right: '',
		marginTop: '',
		marginLeft: ''
	}, position);
	Object.assign(dialogDom.style, position);
	return position;
};
// 去诶和现实隐藏
const toggleDisplay = function (ele, val) {
	if (!ele || !ele.nodeType) {
		return;
	}
	if (!val) {
		Object.assign(ele.style, {
			visibility: 'visible'
		});
	} else {
		Object.assign(ele.style, {
			left: '-9999px',
			top: '-9999px',
			visibility: 'hidden'
		});
	}
};
// 初始化事件
const evetInit = function () {
	let eventKey = [
		// 显示 dialog，动画完成，彻底的显示出来
		'show',
		// 隐藏dialog，动画完成，彻底的隐藏
		'hide',
		// 带data-action的按钮被点击
		'btnClick',
		// 准备销毁对话框前，还没销毁，返回false可以取消
		'beforeClose',
		// 关闭已经结束，对话框消失但是dom还存在
		'close',
		// 彻底销毁dialog所有得一切都没有了
		'closed',
		// 系统的挂在
		'hook:beforeMount',
		'hook:mounted',
		'hook:beforeUpdate',
		'hook:updated'
	];
	// create方法桌面释放出去？？？
	let re = /(?:hook:)?([a-z])/;
	let prop = eventKey.reduce((result, current) => {
		let key = current.replace(re, function (all, one) {
			return one ? 'on' + one.toUpperCase() : 'on';
		});
		result[key] = function (fun) {
			if (typeof fun === 'function') {
				this.$on(current, fun);
			}
			return this;
		};
		return result;
	}, {});
	return prop;
};
let bindEnd = function (ele, end) {
	let info = getTransitionInfo(ele);
	let time = null;
	// 立即执行
	if (info.timeout === 0) {
		end();
	} else {
		let callEnd = function () {
			if (time) {
				window.clearTimeout(time);
			}
			ele.removeEventListener(transitionEndEvent, callEnd);
			end();
		};
		time = window.setTimeout(callEnd, info.timeout);
		ele.addEventListener(transitionEndEvent, callEnd);
	}
};
// 动画方法
// 如果animate属性给错误会导致调用出错
const animate = function (vm, isHidden) {
	let dialog = vm.$refs.dialog;
	let el = vm.$el;
	let rect = window.getComputedStyle(el);
	if (vm._animate) {
		return;
	}
	vm._animate = true;
	// 根节点隐藏，不进行动画
	if (rect.display === 'none') {
		vm._animate = false;
		return;
	}
	let animate = vm.animate;
	if (animate === 0 || isIE) {
		vm.hidden = isHidden;
		toggleDisplay(vm.$el, isHidden);
		vm._animate = false;
		vm.$emit(isHidden ? 'hide' : 'show');
		return;
	}
	// 要执行动画的class
	let css = 'es-dialog-ani-' + animate;
	let dur = 'es-ani-' + (isHidden ? 'hide' : 'show');
	// 动画结束方法
	let end = function () {
		vm._animate = false;
		vm.animateCss = [];
		isHidden && toggleDisplay(vm.$el, isHidden);
		vm.$emit(isHidden ? 'hide' : 'show');
	};
	// 这里只考虑 transition会有多个时间表示
	// transition: all .3s,.2s cubic-bezier(.07, .72, .32, 1.3)
	vm.animateCss = [isHidden ? dur : css];
	if (isHidden) {
		window.setTimeout(function () {
			vm.animateCss.push(css);
			bindEnd(dialog, end);
		}, 48);
	} else {
		toggleDisplay(vm.$el, isHidden);
		window.setTimeout(function () {
			vm.animateCss.push(dur);
			window.setTimeout(function () {
				vm.animateCss = [dur];
				bindEnd(dialog, end);
			}, 16);
		}, 48);
	}
};
const changeMaskOpactiy = function () {
	// 如果是 模态对话框切换层级，理论上不可能发生，只有掉api才能出现这种效果，这个时候需要切换透明度
	let dialogs = dialogManager.getAllInstance();
	let status = true;
	dialogs.forEach(vm => {
		let layout = +vm.layout;
		// 当前dialog存在且当前dialog没有隐藏，且当前dialog有蒙层
		if (layout !== -1 && layout !== 0 && vm.$mask && !vm.hidden) {
			// 第一个找到的背景变成半透
			if (status) {
				vm.$mask.$el.style.opacity = '';
				status = false;
			} else {
				vm.$mask.$el.style.opacity = '0';
			}
		}
	});
};
const remove = function () {
	let el = this.$el.parentNode;
	if (el) {
		this.$destroy();
		el.removeChild(this.$el);
	}
};
const close = function (ret) {
	if (ret !== null && ret !== undefined) {
		this._closeRet = ret;
	}
	if (this._closing) {
		return this;
	}
	let result = this._$$emit('beforeClose', this._closeRet);
	if (result.some(cur => cur === false)) {
		return this;
	}
	this._closing = true;
	if (!this.hidden) {
		// 没有隐藏
		this.$once('hide', function () {
			remove.call(this);
			this._closing = false;
		});
		this.hide();
	} else {
		remove.call(this);
		this._closing = false;
	}
};
// dialog渲染对象
const base = {
	props: {
		name: 'dialog',
		// 对话框title数据
		titleData: {
			type: [Object],
			default: function () {
				return {};
			}
		},
		// 对话框content数据
		contentData: {
			type: [Object],
			default: function () {
				return {};
			}
		},
		button: {
			type: [Array, null],
			default: function () {
				return ['*确定'];
			}
		},
		/** 对话框 宽度 */
		width: {
			type: [String, Number],
			default: 0
		},
		/** 对话框 高度 */
		height: {
			type: [String, Number],
			default: 0
		},
		/** 对话框位置 */
		// 只有初始化的时候检测？？ 后面就不检测了........
		position: {
			type: [String, Object, Number, Array, Function],
			default: 'c',
			validator: checkPosition
		},
		/**
		 * 是否可以拖动，只有title才可以拖动
		 * 1 | true可以多动
		 * false | 0 不可以拖动
		 */
		dragable: {
			type: [Number, Boolean],
			default: true
		},
		/**
		 * 是否带背景蒙层
		 * 0不显示 -1强制全透明 1半透明 2强制半透明
		 * 多个dialog叠加的时候 会自动全透明，如果不希望是半透明，可以设置2，强制透明
		 */
		layout: {
			type: [Number, Boolean],
			default: 1
		},
		/**
		 * 动画类型
		 * //0 无动画
		 * [1,2] 内置动画
		 * [3,9] CSS3动画
		 * [11,19]/[21,29]组合动画
		 */
		animate: {
			type: Number,
			default: 0
		},
		stylesheet: {
			type: [Array, Object],
			default: function () {
				return {};
			}
		},
		/** 对话框class*/
		css: {
			type: [String, Object, Array],
			default: ''
		},
		/**
		 * 自动关闭
		 * 0 标示不能自动关闭
		 * 其他值标示 多少毫秒后关闭
		 */
		timeout: {
			type: Number,
			default: 0
		},
		/**
		 * 锁定页面大小，只有 模态对话框才有用
		 */
		lock: {
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
			maskIndex: dialogManager.nextZIndex(),
			dialogIndex: dialogManager.nextZIndex(),
			//  这个属性请不要乱改执行动画用
			animateCss: [],
			hidden: true,
			dialogPos: 'fixed',
			maskPos: 'fixed'
		};
	},
	beforeCreate () {
		// 设置当前组件的id
		Object.defineProperty(this, 'id', {
			value: 'esDialog' + guid(),
			enumerable: true
		});
		// 将当前的dialog添加到 队列中
		dialogManager.add(this);
		// 设置当前组件的id
		Object.defineProperty(this, 'dialogManager', {
			value: dialogManager,
			enumerable: true
		});
		// 这样定义防止用户修改这个属性
		//  定义title方法
		Object.defineProperty(this, 'title', {
			value: (component) => {
				if (component === undefined) {
					return this._title;
				} else {
					this._title = component;
				}
			}
		});
		// 定义 content方法
		Object.defineProperty(this, 'content', {
			value: (component) => {
				if (component === undefined) {
					return this._content;
				} else {
					this._content = component;
				}
			}
		});
		//  自定义一个emit
		this._$$emit = function (event) {
			let vm = this;
			let cbs = vm._events[event];
			let result = [];
			if (cbs) {
				cbs = cbs.length > 1 ? toArray(cbs) : cbs;
				let args = toArray(arguments, 1);
				for (let i = 0, l = cbs.length; i < l; i++) {
					result.push(cbs[i].apply(vm, args));
				}
			}
			return result;
		};
	},
	created () {
		let vm = this;
		// title content 定义成一个私有的属性，不准用户修改，只能通过 content和title方法修改, 修改直接调用重绘方法
		//  用属性会有问题，因为如果属性是个  {}则修改子对象无法触发更新
		let title = '';
		let content = '';
		Object.defineProperty(this, '_title', {
			enumerable: false,
			configurable: false,
			get () {
				return title;
			},
			set (val) {
				if (val === undefined) {
					return;
				}
				title = val;
				vm.$nextTick(function () {
					if (title !== null) {
						vm._titleComponent = prepareComponent(title, 'title', vm);
					} else {
						vm._titleComponent = '';
					}
					vm.$forceUpdate();
					vm.setPosition(true);
					vm.$emit('changeTitle');
				});
			}
		});
		Object.defineProperty(this, '_content', {
			enumerable: false,
			configurable: false,
			get () {
				return content;
			},
			set (val) {
				if (val === undefined) {
					return;
				}
				content = val;
				vm._contentComponent = prepareComponent(content || '', 'content', vm);
				vm.$forceUpdate();
				vm.setPosition(true);
				vm.$emit('changeContent');
			}
		});
	},
	mounted () {
		if (this.$refs.$mask) {
			this.$mask = this.$refs.$mask;
		}
		this.focusBtn();
		callWidth.call(this);
		callHeight.call(this);
		callPos.call(this);
		window.setTimeout(() => {
			this.hidden = false;
		});
	},
	updated () {
		if (this.$refs.$mask) {
			this.$mask = this.$refs.$mask;
		} else {
			delete this.$mask;
		}
	},
	beforeDestroy () {
		this.$emit('close', this._closeRet);
	},
	destroyed () {
		dialogManager.del(this);
		this.$emit('closed', this._closeRet);
	},
	render (createElement) {
		// 遮罩index
		let maskIndex = this.maskIndex;
		// 弹窗index
		let index = this.dialogIndex;
		let style = polymerStyle.call(this, {
			zIndex: index,
			position: this.dialogPos
		});
		let css = polymerCss.call(this, 'es-dialog', 'm-dialog');
		css = css.concat(this.animateCss);
		let dialogNode = [];
		dialogNode.push(renderHeader.call(this, createElement));
		dialogNode.push(renderBody.call(this, createElement));
		if (this.button && this.button.length) {
			dialogNode.push(renderFooter.call(this, createElement));
		}
		let node = [createElement('div', {
			class: css,
			style,
			ref: 'dialog',
			on: {
				click: this.dialogClick
			}
		}, dialogNode)];
		let layout = +this.layout;
		// 0|false 表示不显示蒙层
		if (layout !== 0) {
			let modals = dialogManager.getAllInstance().filter(cur => cur.layout !== 0 && cur.layout !== false && cur.layout !== -1 && !cur.hidden) || [];
			// 绑定mask实例
			node.unshift(createElement(overlay, {
				style: {
					zIndex: maskIndex,
					opacity: modals[0] ? (modals[0] !== this._self ? (layout === 2 ? '' : '0') : (layout === -1 ? '0' : '')) : ''
				},
				ref: '$mask',
				props: {
					ani: false,
					lockIosHeight: this.lockIosHeight,
					position: this.maskPos,
					resize: !(this.maskPos === 'fixed'),
					fullScreen: true,
					lock: this.lock
				}
			}));
		}
		return createElement('div', {
			class: 'es-dialog-wrap',
			domProps: {
				id: this.id
			}
		}, node);
	},
	watch: {
		// 监控position，如果position发生变化则重新设置位置
		position: function (val, oldVal) {
			if (checkPosition(val)) {
				callPos.call(this);
			} else {
				this.position = oldVal;
			}
		},
		// contentData发生变化则重新生成组件
		contentData: function (val) {
			this._contentComponent = prepareComponent(this.content() || '', 'content', this);
		},
		// titleData发生变化则重新生成组件
		titleData: function () {
			this._titleComponent = prepareComponent(this.title() || '', 'title', this);
		},
		dialogPos: function (val) {
			callPos.call(this);
		},
		width: function (val) {
			callWidth.call(this);
			callPos.call(this);
		},
		height: function (val) {
			callHeight.call(this);
			callPos.call(this);
		},
		hidden: function (val, oldVal) {
			let dialog = this.$refs.dialog;
			if (dialog) {
				changeMaskOpactiy();
				animate(this, val);
			} else {
				// 初次进入的时候出发
				this.$nextTick(function () {
					changeMaskOpactiy();
					animate(this, val);
				});
			}
		},
		timeout: {
			handler: function (val) {
				if (!val) {
					return;
				}
				if (this._closeTimer) {
					window.clearTimeout(this._closeTimer);
				}
				this._closeTimer = window.setTimeout(() => {
					this.close();
				}, val);
			},
			immediate: true
		}
	},
	methods: {
		setTop () {
			// 将当前dialog实例调整到队列的最前面，如果位置没变化就什么都没有返回
			let result = dialogManager.setTopInstance(this);
			if (result) {
				this.maskIndex = dialogManager.nextZIndex();
				this.dialogIndex = dialogManager.nextZIndex();
				this.focusBtn();
				changeMaskOpactiy();
			}
		},
		dialogClick (event) {
			// 按钮事件处理
			let target = event.target;
			let dialog = this.$refs.dialog;
			if (dialog) {
				while (target) {
					if (target.nodeType === 1) {
						let action = target.getAttribute('data-action');
						if (action === 'btn' || action === 'close') {
							let ret = target.getAttribute('data-ret') || null;
							if (/^[-.\d]+$/.test(ret)) {
								ret = +ret;
							}
							let results = this._$$emit('btnClick', ret);
							if (results.some(cur => cur === false)) {
								return;
							}
							this._closeRet = ret;
							this.close();
							return;
						}
					}
					if (target === dialog) {
						break;
					} else {
						target = target.parentNode;
					}
				}
			}
			this.setTop();
		},
		focusBtn () {
			let dialog = this.$refs.dialog;
			let btn = dialog.querySelector('.' + globalConf.btnCssMap['*']);
			if (btn) {
				btn.focus();
			}
		},
		setPosition (pos) {
			let t = typeof pos;
			if (pos === true) {
				callPos.call(this);
			} else if (t === 'function') {
				this.position = pos.call(this) || {};
			} else if (t === 'string' || t === 'number' || t === 'object') {
				this.position = pos;
			}
		},
		// 显示
		show () {
			this.hidden = false;
		},
		/**
		 * isAni 如果是 false则强制没有动画
		 */
		hide () {
			this.hidden = true;
		},
		/**
		 * 关闭dialog
		 * @param ret 关闭dialog标志
		 */
		close (ret) {
			if (this._animate || this._isBeingDestroyed || this._isDestroyed) {
				return;
			}
			// 组件没有挂在
			if (this._isMounted) {
				close.call(this, ret);
			} else {
				// 组件没有挂在就等到挂在显示后在销毁
				this.$once('show', function () {
					this.$nextTick(function () {
						close.call(this, ret);
					});
				});
			}
			return this;
		},
		/**
		 * 关闭dialog
		 */
		destroy (ret) {
			return this.close(ret);
		},
		/**
		 * 获取dialog的唯一标示
		 */
		toString () {
			return this.id;
		}
	}
};
var ready = function (fn) {
	if (document.addEventListener) {
		if (~['complete', 'loaded', 'interactive'].indexOf(document.readyState)) {
			setTimeout(fn, 0);
		} else {
			var loadFn = function () {
				document.removeEventListener('DOMContentLoaded', loadFn, false);
				fn();
			};
			document.addEventListener('DOMContentLoaded', loadFn, false);
		}
	}
};
ready(function () {
	document.body.addEventListener('keydown', function (event) {
		if (event.keyCode === 27) {
			let vm = dialogManager.getTopInstance();
			if (vm && vm.$refs.dialog) {
				let btn = vm.$refs.dialog.querySelector('.es-dialog-close');
				if (!btn) {
					return;
				}
				let pos = btn.getBoundingClientRect();
				if (pos.height && pos.width) {
					vm.close();
				}
			}
		}
	});
});

Object.assign(base.methods, evetInit());
// title content  width heigth 是属性，可以直接设置
// dialogManager 导出
export {dialogManager, base};
// 关闭所有
export const closeAll = function () {
	let instances = dialogManager.getAllInstance();
	if (instances) {
		instances.reverse().forEach(cur => {
			cur.close();
		});
	}
};

export const conf = function (opt = {}) {
	// 每个字段做了检测
	if (opt) {
		if (opt.getBtnRetId && typeof opt.getBtnRetId === 'function') {
			globalConf.getBtnRetId = opt.getBtnRetId;
		}
		if (opt.btnCssMap) {
			if (opt.btnCssMap.def) {
				globalConf.btnCssMap.def = opt.btnCssMap.def;
			}
			if (opt.btnCssMap['*']) {
				globalConf.btnCssMap['*'] = opt.btnCssMap['*'];
			}
		}
	}
};
