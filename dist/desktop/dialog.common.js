/*!
 * dialog.js v1.0.0
 * (c) 2014-2017 jianxcao
 * Released under the MIT License.
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Vue = _interopDefault(require('vue'));

if (typeof Object.assign !== 'function') {
	Object.assign = function (target) {
		'use strict';
		var arguments$1 = arguments;

		if (target == null) {
			throw new TypeError('Cannot convert undefined or null to object');
		}

		target = Object(target);
		for (var index = 1; index < arguments.length; index++) {
			var source = arguments$1[index];
			if (source != null) {
				for (var key in source) {
					if (Object.prototype.hasOwnProperty.call(source, key)) {
						target[key] = source[key];
					}
				}
			}
		}
		return target;
	};
}

// requestAnimationFrame的兼容处理
if (!window.requestAnimationFrame) {
	window.requestAnimationFrame = function (fn) {
		setTimeout(fn, 17);
	};
}
if (!Array.isArray) {
	Array.isArray = function (arg) {
		return Object.prototype.toString.call(arg) === '[object Array]';
	};
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
var toString = Object.prototype.toString;
var OBJECT_STRING = '[object Object]';
function isPlainObject (obj) {
	return toString.call(obj) === OBJECT_STRING;
}

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
	start = start || 0;
	var i = list.length - start;
	var ret = new Array(i);
	while (i--) {
		ret[i] = list[i + start];
	}
	return ret;
}

/**
 * Check whether the object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
	return hasOwnProperty.call(obj, key);
}

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = UA && UA.indexOf('android') > 0;
var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

/**
 * 是否是一个vnode
 */
var isVnode = function (node) {
	if (!node || typeof node !== 'object') {
		return false;
	}
	return hasOwn(node, 'tag') && hasOwn(node, 'componentOptions');
};
/**
 * 是不是一个 Vue的组件
 */
var isVueComponent = function (fun) {
	return typeof fun === 'function' && typeof fun['super'] === 'function' && fun.directive && fun.component;
};
var rootEleReg = /^\s*<(\w+)>.*<\/(\w+)>\s*$/;

// 是不是有根元素在外边
var isHaveRootEle = function (str) {
	return typeof str === 'string' && rootEleReg.test(str) && RegExp.$1 === RegExp.$2;
};

// 标记是不是dialog的一个id
var isId = /^esDialog\d+$/;

// Transition property/event sniffing
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';


/* istanbul ignore if */
if (window.ontransitionend === undefined &&
	window.onwebkittransitionend !== undefined) {
	transitionProp = 'WebkitTransition';
	transitionEndEvent = 'webkitTransitionEnd';
}
function getTransitionInfo (Element) {
	var styles = window.getComputedStyle(Element);
	var transitioneDelays = styles[transitionProp + 'Delay'].split(', ');
	var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
	var transitionTimeout = getTimeout(transitioneDelays, transitionDurations);
	var timeout = 0;
	var propCount = 0;
	if (transitionTimeout > 0) {
		timeout = transitionTimeout;
		propCount = transitionDurations.length;
	}
	return {
		timeout: timeout,
		propCount: propCount
	};
}
/**
 * @param delays [Array<string>]
 * @param durations Array<string>
 * @return time [number]返回时间
 */
function getTimeout (delays, durations) {
	// delays的数目必须和 时间段一样
	while (delays.length < durations.length) {
		delays = delays.concat(delays);
	}
	return Math.max.apply(null, durations.map(function (d, i) {
		return toMs(d) + toMs(delays[i]);
	}));
}
/**
 * @param s [String] 如3s
 * @return time [number] 毫秒数目
 */
function toMs (s) {
	return Number(s.slice(0, -1)) * 1000;
}

/* eslint-disable */
// 扩展addClass/removeClass方法
// https://github.com/EarMaster/CSSClass/blob/master/CSSClass.js
(function () {
	// add indexOf to Array prototype for IE<8
	// this isn't failsafe, but it works on our behalf
	Array.prototype.CSSClassIndexOf = Array.prototype.indexOf || function (item) {
		var this$1 = this;

		var length = this.length;
		for (var i = 0; i<length; i++)
			{ if (this$1[i]===item) { return i; } }
		return -1;
	};
	// check if classList interface is available (@see https://developer.mozilla.org/en-US/docs/Web/API/element.classList)
	var cl = ("classList" in document.createElement("a"));
	// actual Element prototype manipulation
	var p = Element.prototype;
	if(cl) {
		if(!p.hasClass)
			{ p.hasClass = function(c) {
				var this$1 = this;

				var e = Array.prototype.slice.call(this.classList);
				c = c.split(' ');
				for(var i=0; i<c.length; i++)
					{ if(!this$1.classList.contains(c[i]))
						{ return false; } }
				return true;
			}; }
		if(!p.addClass)
			{ p.addClass = function(c) {
				var this$1 = this;

				c = c.split(' ');
				for(var i=0; i<c.length; i++)
					{ if(!this$1.hasClass(c[i]))
						{ this$1.classList.add(c[i]); } }
				return this;
			}; }
		if(!p.removeClass)
			{ p.removeClass = function(c) {
				var this$1 = this;

				var e = this.className.split(' ');
				c = c.split(' ');
				for(var i=0; i<c.length; i++)
					{ if(this$1.hasClass(c[i]))
						{ this$1.classList.remove(c[i]); } }
				return this;
			}; }
		if(!p.toggleClass)
			{ p.toggleClass = function(c) {
				var this$1 = this;

				c = c.split(' ');
				for(var i=0; i<c.length; i++)
					{ this$1.classList.toggle(c[i]); }
				return this;
			}; }
	} else {
		if(!p.hasClass)
			{ p.hasClass = function(c) {
				var e = this.className.split(' ');
				c = c.split(' ');
				for(var i=0; i<c.length; i++)
					{ if(e.CSSClassIndexOf(c[i])===-1)
						{ return false; } }
				return true;
			}; }
		if(!p.addClass)
			{ p.addClass = function(c) {
				var this$1 = this;

				c = c.split(' ');
				for(var i=0; i<c.length; i++)
					{ if(!this$1.hasClass(c[i]))
						{ this$1.className = this$1.className!==''?(this$1.className+' '+c[i]):c[i]; } }
				return this;
			}; }
		if(!p.removeClass)
			{ p.removeClass = function(c) {
				var this$1 = this;

				var e = this.className.split(' ');
				c = c.split(' ');
				for(var i=0; i<c.length; i++)
					{ if(this$1.hasClass(c[i]))
						{ e.splice(e.CSSClassIndexOf(c[i]), 1); } }
				this.className = e.join(' ');
				return this;
			}; }
		if(!p.toggleClass)
			{ p.toggleClass = function(c) {
				var this$1 = this;

				c = c.split(' ');
				for(var i=0; i<c.length; i++)
					{ if (this$1.hasClass(c[i]))
						{ this$1.removeClass(c[i]); }
					else
						{ this$1.addClass(c[i]); } }
				return this;
			}; }
	}
	var pl = NodeList.prototype;
	if (!pl.hasClass)
		{ pl.hasClass = function (c, all) {
			var this$1 = this;

			if (all===undefined) { all = true; }
			for (var i=this.length-1; i>=0; --i) {
				var hc = this$1[i].hasClass(c);
				if (all && !hc) { return false; }
				if (!all && hc) { return true; }
			}
			return true;
		}; }
	if (!pl.addClass)
		{ pl.addClass = function (c) {
			var this$1 = this;

			for (var i=0; i<this.length; ++i)
				{ this$1[i].addClass(c); }
		}; }
	if (!pl.removeClass)
		{ pl.removeClass = function (c) {
			var this$1 = this;

			for (var i=0; i<this.length; ++i)
				{ this$1[i].removeClass(c); }
		}; }
	if (!pl.toggleClass)
		{ pl.toggleClass = function (c) {
			var this$1 = this;

			for (var i=0; i<this.length; ++i)
				{ this$1[i].toggleClass(c); }
		}; }
})();

// 队列管理类
var defaultOpt = {
	startZIndex: 1000
};
var PoperManager = function PoperManager (opt) {
	this.opt = Object.assign({}, opt, defaultOpt);
	this._zIndex = this.opt.startZIndex;
	this._instance = [];
	// 绑定this方便外部调用
	this.add = this.add.bind(this);
	this.del = this.del.bind(this);
	this.indexOf = this.indexOf.bind(this);
	this.setTopInstance = this.setTopInstance.bind(this);
	this.getTopInstance = this.getTopInstance.bind(this);
	this.getAllInstance = this.getAllInstance.bind(this);
	this.nextZIndex = this.nextZIndex.bind(this);
};
// 添加一个实例
PoperManager.prototype.add = function add (instance) {
	if (instance && instance.id && instance instanceof Vue && this.indexOf(instance) === -1) {
		this._instance.push(instance);
	}
	return instance;
};
PoperManager.prototype.size = function size () {
	return this._instance.length;
};
/**
	 * 查找一个实例是否存在
	 * 可以传入一个id或者一个 vue实例
	 */
PoperManager.prototype.indexOf = function indexOf (instance) {
		var this$1 = this;

	var t = typeof instance;
	if (t === 'string' && isId.test(instance) || t === 'object' && instance instanceof Vue) {
		for (var i = 0, l = this._instance.length; i < l; i++) {
			var cur = this$1._instance[i];
			if (cur === instance || cur.id === instance) {
				return i;
			}
		}
	}
	return -1;
};
/**
	 * 删除一个实例
	 * @param string | object
	 * 可以传入一个id或者一个 vue实例删除,删除成功返回true，否则返回false
	 */
PoperManager.prototype.del = function del (instance) {
	var index = this.indexOf(instance);
	if (index > -1) {
		this._instance.splice(index, 1);
		return true;
	}
	return false;
};
/**
	 * 是否所有组件已经挂载
	 */
PoperManager.prototype.isAllMounted = function isAllMounted () {
	return this._instance.every(function (cur) { return cur && cur._isMounted; });
};
/**
	 * 将某个instance置换到顶层
	 * * @param string | object
	 * 可以传入一个id或者一个 vue实例, 如果当前实例不再顶层，则置换到顶层,如果传入非法或者不是一个实例则不进行任何操作
	 */
PoperManager.prototype.setTopInstance = function setTopInstance (instance) {
	var index = this.indexOf(instance);
	// 只有当前所有弹窗都已经挂载，才可以改变dialog的顺序
	if (index > -1 && index !== this._instance.length - 1 && this.isAllMounted()) {
		var cur = this._instance.splice(index, 1);
		this._instance.push(cur[0]);
		return cur;
	}
};
/**
	 * 获取最顶层的实例
	 */
PoperManager.prototype.getTopInstance = function getTopInstance () {
	if (this._instance.length) {
		return this._instance[this._instance.length - 1];
	}
};
/**
	 * 通过id获取一个instance
	 */
PoperManager.prototype.getInstance = function getInstance (id) {
	var index = this.indexOf(id);
	if (index > -1) {
		return this._instance[index];
	}
};
/**
	 * 获取所有 instance
	 */
PoperManager.prototype.getAllInstance = function getAllInstance () {
	return (this._instance || []).slice(0);
};
/**
	 * 获取下一个index
	 */
PoperManager.prototype.nextZIndex = function nextZIndex () {
	return this._zIndex++;
};
/**
 * 返回一个PoperManager的实例
 */
var manager = function () {
	return new PoperManager();
};

/**
 * 产生一个遮罩层
 */
/* eslint-disable */
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
var overlay = {
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
	data: function data () {
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
	mounted: function mounted () {
		var ele;
		var $ele = this.$el;
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
		var style = ele.style;
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
	destroyed: function destroyed () {
		// 销毁注销事件
		if (this._lockParentEle) {
			var style = this._lockParentEle.style;
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
	render: function render (createElement) {
		// this.position用户传递过来得position
		// 如果用户设置了，程序就不会自动切换了
		var directives = [];
		// 更新位置显示出来
		// 第一次更新无效，因为组件还米有挂载好，挂在后执行才有效果
		var child = createElement('div', {
			class: 'layout mask',
			directives: directives
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
		maskSize: function maskSize (width, height) {
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
						var info = this._lockParentEle.getBoundingClientRect();
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
		update: function update () {
			var $ele = this.$el;
			var setPos = this.position;
			var ele = this._lockParentEle;
			if (!ele) {
				return this;
			}
			var style = ele.style;
			// 如果是锁定模式
			if (this.lock) {
				style.overflow = 'hidden';
				// 是body
				if (this.bodyContainer) {
					document.documentElement.style.overflow = 'hidden';
					if (isIOS && this.lock && this.lockIosHeight) {
						var h = window.innerHeight + 'px';
						document.documentElement.style.height = h;
						document.body.style.height = h;
						document.body.addClass('body-overflow');
						document.body.style.webkitOverflowScrolling = 'auto';
						var w = "-" + (this._originScrollTop) + "px";
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
				var ref = window.getComputedStyle(ele);
				var position = ref.position;
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
		bodyResize: function bodyResize () {
			var this$1 = this;

			// 移动端设备下必须延迟时间否则会取不到正确得高度
			if (this._resizeTime) {
				window.clearTimeout(this._resizeTime);
			}
			this._resizeTime = window.setTimeout(function () {
				this$1.maskSize();
			}, 350);
		}
	}
};

var Mask = Vue.extend({
	data: function data () {
		return {
			closed: true
		};
	},
	render: function render (createElement) {
		var directives = [];
		directives.push({
			name: 'show',
			rawName: 'v-show',
			value: !this.closed,
			expression: '!closed'
		});
		return createElement('overlay', {
			directives: directives,
			props: {
				lock: this.lock,
				position: this.position,
				resize: this.resize,
				ani: this.ani
			}
		});
	},
	methods: {
		destroy: function destroy () {
			this.closed = true;
			if (this.ani && !this.$isServer) {
				this.$el.addEventListener(transitionEndEvent, this.doDestroy);
			} else {
				this.doDestroy();
			}
		},
		doDestroy: function doDestroy () {
			if (this.$el) {
				this.$destroy();
				this.$el.parentNode.removeChild(this.$el);
			}
		}
	},
	components: {
		overlay: overlay
	}
});
/**
 * target 遮罩目标元素
 * lock 是否给 目标元素添加 overflow为hidden
 * position 是否强制设置 position 可以设置 absolute或者fixed
 * resize 是否绑定body的resize事件在body大小更新时更新组件大小
 * ani 是否需要动画 动画 是一  className 以overlay开始，遵循 vue动画规则
 */

/**
 * 整个dialog对象
 * pc 和 wap公用的部分
 */
var dialogManager = manager();
var guid = (function (start) { return function () { return start++; }; })(0);
var startWidthStar = /^\*.+/;
var isNumber = /^\d+$/;
// dialog全局配置
var globalConf = {
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
var posReg = {
	l: /l/i,
	t: /t/i,
	r: /r/i,
	b: /b/i,
	c: /c/i
};
// 检测输如 position的合法性
var checkPosition = (function () {
	var checkPos = /(^[lcr][tcb]$)|(^[tcb][lcr]$)|(^[tcblr]$)/;
	var posKeys = ['left', 'top', 'bottom', 'right', 'marginTop', 'marginLeft'];
	return function (val) {
		var t = typeof val;
		if (t === 'function') {
			return true;
		}
		if (isPlainObject(val)) {
			return posKeys.some(function (cur) { return cur !== undefined && cur !== null; });
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
var prepareComponent = function (content, ref, instances) {
	// 已经是vnode直接返回
	if (isVnode(content)) {
		return content;
	} else {
		var name = (instances.id) + "-" + ref;
		var t = typeof content;
		if (t === 'string' || t === 'number') {
			if (!isHaveRootEle(content)) {
				content = {
					name: name,
					template: ['<div>', content, '</div>'].join('')
				};
			} else {
				content = {
					name: name,
					template: content + ''
				};
			}
		}
		var mixin = {
			beforeCreate: function beforeCreate () {
				instances['$' + ref] = this;
			},
			data: function data () {
				return ( obj = {
					dialogData: instances[ref + 'Data']
				}, obj[ref + 'Data'] = instances[ref + 'Data'], obj );
				var obj;
			}
		};
		var component;
		if (isVueComponent(content)) {
			component = content.extend({
				mixins: [mixin]
			});
			if (!component.options.name) {
				component.options.name = name;
			}
		} else {
			if (content._Ctor && content._Ctor[Vue.cid]) {
				component = content._Ctor[Vue.cid].extend({
					mixins: [mixin]
				});
			} else {
				component = Vue.extend(content);
				component.mixin(mixin);
			}
		}
		// 取到options上的data保存
		return component;
	}
};
// 创建vnode
var prepareVnode = function (component, propsData, ref, createElement) {
	if ( propsData === void 0 ) propsData = {};

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
var renderHeader = function (createElement) {
	var title = this.title();
	// title 是null或者undefined则不渲染title
	if (title === undefined || title === null) {
		return createElement('');
	}
	// 渲染 title slot
	var titleNode = [this._t('title')];
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
var renderBody = function (createElement) {
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
var renderFooter = function (createElement) {
	var button = this.button;
	var l = button.length;
	var nodes = button.map(function (cur, index) {
		var is = startWidthStar.test(cur);
		var cls = {};
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
var polymerCss = function () {
	var args = [], len = arguments.length;
	while ( len-- ) args[ len ] = arguments[ len ];

	var css = this.css;
	var result = [];
	if (typeof css === 'string') {
		result = css.split(' ').map(function (cur) { return cur.trim(); });
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
var polymerStyle = function (defaultStyle) {
	var style = [];
	if (defaultStyle) {
		style.push(defaultStyle);
	}
	var stylesheet = this.stylesheet;
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
var callWidth = function () {
	// 正在销毁，或者没有挂在都直接返回
	if (this._isBeingDestroyed || this._isDestroyed || !this._isMounted) {
		return;
	}
	var dialogDom = this.$refs.dialog;
	// 整数的情况下认为是px为单位，如果是个字符串就认为是别的单位
	if (isNumber.test(this.width)) {
		var w = parseInt(this.width, 10);
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
var callHeight = function () {
	// 正在销毁，或者没有挂在都直接返回
	if (this._isBeingDestroyed || this._isDestroyed || !this._isMounted) {
		return;
	}
	var main = this.$refs.main;
	// 整数的情况下认为是px为单位，如果是个字符串就认为是别的单位
	if (isNumber.test(this.height)) {
		var w = parseInt(this.height, 10);
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
var callPos = function () {
	// 正在销毁，或者没有挂在都直接返回
	if (this._isBeingDestroyed || this._isDestroyed || !this._isMounted) {
		return {};
	}
	// 当前是隐藏状态，不显示
	var pos = this.position;
	var dialogDom = this.$refs.dialog;
	var position = {};
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
	var rect = dialogDom.getBoundingClientRect();
	// 没有宽度就不定位
	if (rect.width === 0) {
		return {};
	}
	var width = rect.width;
	var height = rect.height;
	var fixed = this.dialogPos === 'fixed';
	var	win = window;
	var	scrollFix = [
		Math.max(document.body.scrollLeft, document.documentElement.scrollLeft),
		Math.max(document.documentElement.scrollTop, document.body.scrollTop)];
		// left,top,right,bottom
	var	workArea = [0, 0, win.innerWidth, win.innerHeight];
		// 计算预置的X、Y坐标
	var	X = {
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
	var	Y = {
		top: (function () { /* 上 */
			return fixed ? {
				top: 0
			} : {
				top: workArea[1] + scrollFix[1] + 'px'
			};
		})(),
		center: (function () { /* 中 */
			var top = Math.floor((workArea[3] + workArea[1] - height) / 2) + scrollFix[1];
				// 溢出屏幕的距离
			var	overflowH = top < 0 ? Math.abs(top) : 0;
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
		var val = position[key];
		var	keepValue = ['auto', 'c', 'center'];
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
var toggleDisplay = function (ele, val) {
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
var evetInit = function () {
	var eventKey = [
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
	var re = /(?:hook:)?([a-z])/;
	var prop = eventKey.reduce(function (result, current) {
		var key = current.replace(re, function (all, one) {
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
var bindEnd = function (ele, end) {
	var info = getTransitionInfo(ele);
	var time = null;
	// 立即执行
	if (info.timeout === 0) {
		end();
	} else {
		var callEnd = function () {
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
var animate = function (vm, isHidden) {
	var dialog = vm.$refs.dialog;
	var el = vm.$el;
	var rect = window.getComputedStyle(el);
	if (vm._animate) {
		return;
	}
	vm._animate = true;
	// 根节点隐藏，不进行动画
	if (rect.display === 'none') {
		vm._animate = false;
		return;
	}
	var animate = vm.animate;
	if (animate === 0 || isIE) {
		vm.hidden = isHidden;
		toggleDisplay(vm.$el, isHidden);
		vm._animate = false;
		vm.$emit(isHidden ? 'hide' : 'show');
		return;
	}
	// 要执行动画的class
	var css = 'es-dialog-ani-' + animate;
	var dur = 'es-ani-' + (isHidden ? 'hide' : 'show');
	// 动画结束方法
	var end = function () {
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
var changeMaskOpactiy = function () {
	// 如果是 模态对话框切换层级，理论上不可能发生，只有掉api才能出现这种效果，这个时候需要切换透明度
	var dialogs = dialogManager.getAllInstance();
	var status = true;
	dialogs.forEach(function (vm) {
		var layout = +vm.layout;
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
var remove = function () {
	var el = this.$el.parentNode;
	if (el) {
		this.$destroy();
		el.removeChild(this.$el);
	}
};
var close = function (ret) {
	if (ret !== null && ret !== undefined) {
		this._closeRet = ret;
	}
	if (this._closing) {
		return this;
	}
	var result = this._$$emit('beforeClose', this._closeRet);
	if (result.some(function (cur) { return cur === false; })) {
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
var base = {
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
	data: function data () {
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
	beforeCreate: function beforeCreate () {
		var this$1 = this;

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
			value: function (component) {
				if (component === undefined) {
					return this$1._title;
				} else {
					this$1._title = component;
				}
			}
		});
		// 定义 content方法
		Object.defineProperty(this, 'content', {
			value: function (component) {
				if (component === undefined) {
					return this$1._content;
				} else {
					this$1._content = component;
				}
			}
		});
		//  自定义一个emit
		this._$$emit = function (event) {
			var vm = this;
			var cbs = vm._events[event];
			var result = [];
			if (cbs) {
				cbs = cbs.length > 1 ? toArray(cbs) : cbs;
				var args = toArray(arguments, 1);
				for (var i = 0, l = cbs.length; i < l; i++) {
					result.push(cbs[i].apply(vm, args));
				}
			}
			return result;
		};
	},
	created: function created () {
		var vm = this;
		// title content 定义成一个私有的属性，不准用户修改，只能通过 content和title方法修改, 修改直接调用重绘方法
		//  用属性会有问题，因为如果属性是个  {}则修改子对象无法触发更新
		var title = '';
		var content = '';
		Object.defineProperty(this, '_title', {
			enumerable: false,
			configurable: false,
			get: function get () {
				return title;
			},
			set: function set (val) {
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
			get: function get () {
				return content;
			},
			set: function set (val) {
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
	mounted: function mounted () {
		var this$1 = this;

		if (this.$refs.$mask) {
			this.$mask = this.$refs.$mask;
		}
		this.focusBtn();
		callWidth.call(this);
		callHeight.call(this);
		callPos.call(this);
		window.setTimeout(function () {
			this$1.hidden = false;
		});
	},
	updated: function updated () {
		if (this.$refs.$mask) {
			this.$mask = this.$refs.$mask;
		} else {
			delete this.$mask;
		}
	},
	beforeDestroy: function beforeDestroy () {
		this.$emit('close', this._closeRet);
	},
	destroyed: function destroyed () {
		dialogManager.del(this);
		this.$emit('closed', this._closeRet);
	},
	render: function render (createElement) {
		// console.log('in render');
		// 遮罩index
		var maskIndex = this.maskIndex;
		// 弹窗index
		var index = this.dialogIndex;
		var style = polymerStyle.call(this, {
			zIndex: index,
			position: this.dialogPos
		});
		var css = polymerCss.call(this, 'es-dialog', 'm-dialog');
		css = css.concat(this.animateCss);
		var dialogNode = [];
		dialogNode.push(renderHeader.call(this, createElement));
		dialogNode.push(renderBody.call(this, createElement));
		if (this.button && this.button.length) {
			dialogNode.push(renderFooter.call(this, createElement));
		}
		var node = [createElement('div', {
			class: css,
			style: style,
			ref: 'dialog',
			on: {
				click: this.dialogClick
			}
		}, dialogNode)];
		var layout = +this.layout;
		// 0|false 表示不显示蒙层
		if (layout !== 0) {
			var modals = dialogManager.getAllInstance().filter(function (cur) { return cur.layout !== 0 && cur.layout !== false && cur.layout !== -1 && !cur.hidden; }) || [];
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
		contentData: function () {
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
			var dialog = this.$refs.dialog;
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
				var this$1 = this;

				if (!val) {
					return;
				}
				if (this._closeTimer) {
					window.clearTimeout(this._closeTimer);
				}
				this._closeTimer = window.setTimeout(function () {
					this$1.close();
				}, val);
			},
			immediate: true
		}
	},
	methods: {
		setTop: function setTop () {
			// 将当前dialog实例调整到队列的最前面，如果位置没变化就什么都没有返回
			var result = dialogManager.setTopInstance(this);
			if (result) {
				this.maskIndex = dialogManager.nextZIndex();
				this.dialogIndex = dialogManager.nextZIndex();
				this.focusBtn();
				changeMaskOpactiy();
			}
		},
		dialogClick: function dialogClick (event) {
			var this$1 = this;

			// 按钮事件处理
			var target = event.target;
			var dialog = this.$refs.dialog;
			if (dialog) {
				while (target) {
					if (target.nodeType === 1) {
						var action = target.getAttribute('data-action');
						if (action === 'btn' || action === 'close') {
							var ret = target.getAttribute('data-ret') || null;
							if (/^[-.\d]+$/.test(ret)) {
								ret = +ret;
							}
							var results = this$1._$$emit('btnClick', ret);
							if (results.some(function (cur) { return cur === false; })) {
								return;
							}
							this$1._closeRet = ret;
							this$1.close();
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
		focusBtn: function focusBtn () {
			var dialog = this.$refs.dialog;
			var btn = dialog.querySelector('.' + globalConf.btnCssMap['*']);
			if (btn) {
				btn.focus();
			}
		},
		setPosition: function setPosition (pos) {
			var t = typeof pos;
			if (pos === true) {
				callPos.call(this);
			} else if (t === 'function') {
				this.position = pos.call(this) || {};
			} else if (t === 'string' || t === 'number' || t === 'object') {
				this.position = pos;
			}
		},
		// 显示
		show: function show () {
			this.hidden = false;
		},
		/**
		 * isAni 如果是 false则强制没有动画
		 */
		hide: function hide () {
			this.hidden = true;
		},
		/**
		 * 关闭dialog
		 * @param ret 关闭dialog标志
		 */
		close: function close$1 (ret) {
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
		destroy: function destroy (ret) {
			return this.close(ret);
		},
		/**
		 * 获取dialog的唯一标示
		 */
		toString: function toString () {
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
			var vm = dialogManager.getTopInstance();
			if (vm && vm.$refs.dialog) {
				var btn = vm.$refs.dialog.querySelector('.es-dialog-close');
				if (!btn) {
					return;
				}
				var pos = btn.getBoundingClientRect();
				if (pos.height && pos.width) {
					vm.close();
				}
			}
		}
	});
});

Object.assign(base.methods, evetInit());
// 关闭所有
var closeAll = function () {
	var instances = dialogManager.getAllInstance();
	if (instances) {
		instances.reverse().forEach(function (cur) {
			cur.close();
		});
	}
};

var conf$1 = function (opt) {
	if ( opt === void 0 ) opt = {};

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

/**
 * vue dialog插件的安装
 */
var _Vue;

var installed = false;
/**
 * 传入dialog
 * 传入 dialogComponent取创建 es-dialog标签
 */
var install = function (dialog, dialogComponent) { return function install (Vue$$1) {
	if (installed) {
		return;
	}
	installed = true;

	_Vue = Vue$$1;
	// 定义vue实例的 dialog方法，在实例中可以直接使用 $dialog
	Object.defineProperties(Vue$$1.prototype, {
		'$dialog': {
			value: dialog,
			enumerable: true,
			writable: true
		},
		'$alert': {
			value: dialog.alert,
			enumerable: true,
			writable: true
		},
		'$confirm': {
			value: dialog.confirm,
			enumerable: true,
			writable: true
		},
		'$toast': {
			value: function () {
				var arg = [], len = arguments.length;
				while ( len-- ) arg[ len ] = arguments[ len ];

				return dialog.toast.apply(dialog, arg);
			},
			enumerable: true,
			writable: true
		},
		'$error': {
			value: dialog.error,
			enumerable: true,
			writable: true
		}
	});
}; };

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
var main = function (Dialog) {
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
		var t = typeof opt;
		if (t === 'string') {
			// 是一个id查找关闭这个dialog
			if (isId.test(opt)) {
				var instance = dialogManager.getInstance(opt);
				if (instance) {
					var ret = typeof callback === 'string' ? callback : undefined;
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
		opt.stylesheet = ['style', 'cssObj'].reduce(function (result, key) {
			var current = opt[key];
			if (current) {
				Array.isArray(current.concat) ? result = result.concat(current) : result.push(current);
				delete opt[key];
			}
			return result;
		}, []);
		// 处理css属性
		opt.css = ['class', 'className', 'classname', 'css'].reduce(function (result, key) {
			var current = opt[key];
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
			created: function created () {
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
	}

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
	var info = function (content, btn, callback, _defaultBtn, _defaultCss) {
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
	dialog.conf = conf$1;
	// 挂接到方法上
	dialog.closeAll = dialog.destroyAll = closeAll;
	return dialog;
};

/**
 * pc版本dialog
 */
var Dialog = Vue.extend({
	mixins: [base]
});
// 生成dialog调用方法
var dialog = main(Dialog);
// 导出 alert方法
var alert = dialog.alert;
// 导出toast方法
var toast = dialog.toast;
// 导出 conf方法
var confirm = dialog.confirm;
//  info方法
var info = dialog.info;
//  error方法
var error = dialog.error;
// 导出 dialog全局配置方法
var conf$$1 = dialog.conf;

exports['default'] = dialog;
exports.alert = alert;
exports.toast = toast;
exports.confirm = confirm;
exports.info = info;
exports.error = error;
exports.conf = conf$$1;
