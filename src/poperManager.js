// 队列管理类
const defaultOpt = {
	startZIndex: 1000
};
import Vue from 'vue';
import {isId} from './util';
export class PoperManager {
	constructor (opt) {
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
	}
	// 添加一个实例
	add (instance) {
		if (instance && instance.id && instance instanceof Vue && this.indexOf(instance) === -1) {
			this._instance.push(instance);
		}
		return instance;
	}
	size () {
		return this._instance.length;
	}
	/**
	 * 查找一个实例是否存在
	 * 可以传入一个id或者一个 vue实例
	 */
	indexOf (instance) {
		let t = typeof instance;
		if (t === 'string' && isId.test(instance) || t === 'object' && instance instanceof Vue) {
			for (let i = 0, l = this._instance.length; i < l; i++) {
				let cur = this._instance[i];
				if (cur === instance || cur.id === instance) {
					return i;
				}
			}
		}
		return -1;
	}
	/**
	 * 删除一个实例
	 * @param string | object
	 * 可以传入一个id或者一个 vue实例删除,删除成功返回true，否则返回false
	 */
	del (instance) {
		let index = this.indexOf(instance);
		if (index > -1) {
			this._instance.splice(index, 1);
			return true;
		}
		return false;
	}
	/**
	 * 是否所有组件已经挂载
	 */
	isAllMounted () {
		return this._instance.every(cur => cur && cur._isMounted);
	}
	/**
	 * 将某个instance置换到顶层
	 * * @param string | object
	 * 可以传入一个id或者一个 vue实例, 如果当前实例不再顶层，则置换到顶层,如果传入非法或者不是一个实例则不进行任何操作
	 */
	setTopInstance (instance) {
		let index = this.indexOf(instance);
		// 只有当前所有弹窗都已经挂载，才可以改变dialog的顺序
		if (index > -1 && index !== this._instance.length - 1 && this.isAllMounted()) {
			let cur = this._instance.splice(index, 1);
			this._instance.push(cur[0]);
			return cur;
		}
	}
	/**
	 * 获取最顶层的实例
	 */
	getTopInstance () {
		if (this._instance.length) {
			return this._instance[this._instance.length - 1];
		}
	}
	/**
	 * 通过id获取一个instance
	 */
	getInstance (id) {
		let index = this.indexOf(id);
		if (index > -1) {
			return this._instance[index];
		}
	}
	/**
	 * 获取所有 instance
	 */
	getAllInstance () {
		return (this._instance || []).slice(0);
	}
	/**
	 * 获取下一个index
	 */
	nextZIndex () {
		return this._zIndex++;
	}
};
/**
 * 返回一个PoperManager的实例
 */
export default function () {
	return new PoperManager();
};
