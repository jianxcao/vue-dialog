if (typeof Object.assign !== 'function') {
	Object.assign = function (target) {
		'use strict';
		if (target == null) {
			throw new TypeError('Cannot convert undefined or null to object');
		}

		target = Object(target);
		for (var index = 1; index < arguments.length; index++) {
			var source = arguments[index];
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
const toString = Object.prototype.toString;
const OBJECT_STRING = '[object Object]';
export function isPlainObject (obj) {
	return toString.call(obj) === OBJECT_STRING;
};

/**
 * Convert an Array-like object to a real Array.
 */
export function toArray (list, start) {
	start = start || 0;
	let i = list.length - start;
	const ret = new Array(i);
	while (i--) {
		ret[i] = list[i + start];
	};
	return ret;
};

/**
 * Check whether the object has the property.
 */
const hasOwnProperty = Object.prototype.hasOwnProperty;
export function hasOwn (obj, key) {
	return hasOwnProperty.call(obj, key);
};

// Browser environment sniffing
const inBrowser = typeof window !== 'undefined';
const UA = inBrowser && window.navigator.userAgent.toLowerCase();
export const isIE = UA && /msie|trident/.test(UA);
export const isIE9 = UA && UA.indexOf('msie 9.0') > 0;
export const isEdge = UA && UA.indexOf('edge/') > 0;
export const isAndroid = UA && UA.indexOf('android') > 0;
export const isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);
export const isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

/**
 * 是否是一个vnode
 */
export const isVnode = function (node) {
	if (!node || typeof node !== 'object') {
		return false;
	}
	return hasOwn(node, 'tag') && hasOwn(node, 'componentOptions');
};
/**
 * 是不是一个 Vue的组件
 */
export const isVueComponent = function (fun) {
	return typeof fun === 'function' && typeof fun['super'] === 'function' && fun.directive && fun.component;
};
const rootEleReg = /^\s*<(\w+)>.*<\/(\w+)>\s*$/;

// 是不是有根元素在外边
export const isHaveRootEle = str => {
	return typeof str === 'string' && rootEleReg.test(str) && RegExp.$1 === RegExp.$2;
};

// 标记是不是dialog的一个id
export const isId = /^esDialog\d+$/;

// Transition property/event sniffing
export let transitionProp = 'transition';
export let transitionEndEvent = 'transitionend';
export let animationProp = 'animation';
export let animationEndEvent = 'animationend';
/* istanbul ignore if */
if (window.ontransitionend === undefined &&
	window.onwebkittransitionend !== undefined) {
	transitionProp = 'WebkitTransition';
	transitionEndEvent = 'webkitTransitionEnd';
}
if (window.onanimationend === undefined &&
	window.onwebkitanimationend !== undefined) {
	animationProp = 'WebkitAnimation';
	animationEndEvent = 'webkitAnimationEnd';
}

export function getTransitionInfo (Element) {
	const styles = window.getComputedStyle(Element);
	const transitioneDelays = styles[transitionProp + 'Delay'].split(', ');
	const transitionDurations = styles[transitionProp + 'Duration'].split(', ');
	const transitionTimeout = getTimeout(transitioneDelays, transitionDurations);
	let timeout = 0;
	let propCount = 0;
	if (transitionTimeout > 0) {
		timeout = transitionTimeout;
		propCount = transitionDurations.length;
	}
	return {
		timeout,
		propCount
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
	return Math.max.apply(null, durations.map((d, i) => {
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
		var length = this.length;
		for (var i = 0; i<length; i++)
			if (this[i]===item) return i;
		return -1;
	};
	// check if classList interface is available (@see https://developer.mozilla.org/en-US/docs/Web/API/element.classList)
	var cl = ("classList" in document.createElement("a"));
	// actual Element prototype manipulation
	var p = Element.prototype;
	if(cl) {
		if(!p.hasClass)
			p.hasClass = function(c) {
				var e = Array.prototype.slice.call(this.classList);
				c = c.split(' ');
				for(var i=0; i<c.length; i++)
					if(!this.classList.contains(c[i]))
						return false;
				return true;
			};
		if(!p.addClass)
			p.addClass = function(c) {
				c = c.split(' ');
				for(var i=0; i<c.length; i++)
					if(!this.hasClass(c[i]))
						this.classList.add(c[i]);
				return this;
			};
		if(!p.removeClass)
			p.removeClass = function(c) {
				var e = this.className.split(' ');
				c = c.split(' ');
				for(var i=0; i<c.length; i++)
					if(this.hasClass(c[i]))
						this.classList.remove(c[i]);
				return this;
			};
		if(!p.toggleClass)
			p.toggleClass = function(c) {
				c = c.split(' ');
				for(var i=0; i<c.length; i++)
					this.classList.toggle(c[i]);
				return this;
			};
	} else {
		if(!p.hasClass)
			p.hasClass = function(c) {
				var e = this.className.split(' ');
				c = c.split(' ');
				for(var i=0; i<c.length; i++)
					if(e.CSSClassIndexOf(c[i])===-1)
						return false;
				return true;
			};
		if(!p.addClass)
			p.addClass = function(c) {
				c = c.split(' ');
				for(var i=0; i<c.length; i++)
					if(!this.hasClass(c[i]))
						this.className = this.className!==''?(this.className+' '+c[i]):c[i];
				return this;
			};
		if(!p.removeClass)
			p.removeClass = function(c) {
				var e = this.className.split(' ');
				c = c.split(' ');
				for(var i=0; i<c.length; i++)
					if(this.hasClass(c[i]))
						e.splice(e.CSSClassIndexOf(c[i]), 1);
				this.className = e.join(' ');
				return this;
			};
		if(!p.toggleClass)
			p.toggleClass = function(c) {
				c = c.split(' ');
				for(var i=0; i<c.length; i++)
					if (this.hasClass(c[i]))
						this.removeClass(c[i]);
					else
						this.addClass(c[i]);
				return this;
			};
	}
	var pl = NodeList.prototype;
	if (!pl.hasClass)
		pl.hasClass = function (c, all) {
			if (all===undefined) all = true;
			for (var i=this.length-1; i>=0; --i) {
				var hc = this[i].hasClass(c);
				if (all && !hc) return false;
				if (!all && hc) return true;
			}
			return true;
		};
	if (!pl.addClass)
		pl.addClass = function (c) {
			for (var i=0; i<this.length; ++i)
				this[i].addClass(c);
		};
	if (!pl.removeClass)
		pl.removeClass = function (c) {
			for (var i=0; i<this.length; ++i)
				this[i].removeClass(c);
		};
	if (!pl.toggleClass)
		pl.toggleClass = function (c) {
			for (var i=0; i<this.length; ++i)
				this[i].toggleClass(c);
		};
})();
