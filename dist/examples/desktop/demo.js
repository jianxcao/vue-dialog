(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vue')) :
	typeof define === 'function' && define.amd ? define(['exports', 'vue'], factory) :
	(factory((global.demo = {}),global.Vue));
}(this, (function (exports,Vue) { 'use strict';

Vue = Vue && Vue.hasOwnProperty('default') ? Vue['default'] : Vue;

var child = {
	template: '<em>我是子节点</em>'
};
window.child = child;
var Content = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"inner",attrs:{"data-test":"1111"}},[_vm._v(" 我是demo2，我的内容是一个单vue文件，数据是从属性 contentData属性获取"),_c('br'),_vm._v(" "+_vm._s(_vm.ccc)+_vm._s(_vm.dialogData.cjx.cjx)+" "+_vm._s(_vm.dialogData.test)+" "),_c('child',[_vm._v("test")]),_vm._v(" "),_c('button',{on:{"click":_vm.changeT}},[_vm._v("修改test")]),_c('br'),_vm._v(" "),_c('button',{on:{"click":_vm.ff}},[_vm._v("修改cjx")])],1)},staticRenderFns: [],
	data: function data () {
		return {
			ccc: 'ccc'
		};
	},
	methods: {
		ff: function ff () {
			this.dialogData.cjx.cjx = 'cjx' + Math.random();
		},
		changeT: function changeT () {
			this.dialogData.test = Math.random();
		}
	},
	components: {
		child: child
	}
};

var demo$1 = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_vm._v(" dialog demo "),_c('br'),_vm._v(" "),_c('button',{attrs:{"type":"button"},on:{"click":_vm.demo1}},[_vm._v("打开一个普通弹窗")]),_vm._v(" "),_c('button',{attrs:{"type":"button"},on:{"click":_vm.demo2}},[_vm._v("\b弹窗内容是 .Vue单文件")]),_vm._v(" "),_c('button',{attrs:{"type":"button"},on:{"click":_vm.demo3}},[_vm._v("\b弹窗内容是 {template: \"...\"}")]),_vm._v(" "),_c('button',{attrs:{"type":"button"},on:{"click":_vm.demo4}},[_vm._v("\b弹窗内容是 {render: () => {}}")]),_vm._v(" "),_c('button',{attrs:{"type":"button"},on:{"click":_vm.demo4_1}},[_vm._v("\b弹窗内容是 Vnode")]),_vm._v(" "),_c('button',{attrs:{"type":"button"},on:{"click":_vm.demo5}},[_vm._v("\b弹窗值传递")]),_vm._v(" "),_c('button',{attrs:{"type":"button"},on:{"click":_vm.demo6}},[_vm._v("修改弹窗内容")]),_vm._v(" "),_c('button',{attrs:{"type":"button"},on:{"click":_vm.demo7}},[_vm._v("修改弹窗title")]),_vm._v(" "),_c('button',{attrs:{"type":"button"},on:{"click":_vm.demo8}},[_vm._v("修改dialog高度，宽度，位置")]),_vm._v(" "),_c('button',{attrs:{"type":"button"},on:{"click":_vm.demo9}},[_vm._v("\b打开多个非模态窗口")]),_vm._v(" "),_c('button',{attrs:{"type":"button"},on:{"click":_vm.demo10}},[_vm._v("\b打开多个模态窗口")]),_vm._v(" "),_c('button',{attrs:{"type":"button"},on:{"click":_vm.demo11}},[_vm._v("\b动画设置")]),_vm._v(" "),_c('button',{attrs:{"type":"button"},on:{"click":_vm.demo12}},[_vm._v("\bdialog事件演示")]),_vm._v(" "),_c('button',{attrs:{"type":"button"},on:{"click":_vm.demo13}},[_vm._v("dialog全局设置")]),_vm._v(" "),_c('button',{attrs:{"type":"button"},on:{"click":_vm.demo14}},[_vm._v("dialog自动关闭")]),_vm._v(" "),_c('button',{attrs:{"type":"button"},on:{"click":_vm.demo15}},[_vm._v("dialog alert接口")]),_vm._v(" "),_c('button',{attrs:{"type":"button"},on:{"click":_vm.demo16}},[_vm._v("dialog confirm接口")]),_vm._v(" "),_c('button',{attrs:{"type":"button"},on:{"click":_vm.demo17}},[_vm._v("dialog toast接口")])])},staticRenderFns: [],
	data: function data () {
		return {
			animate: 2,
			isShow: false,
			layout: false,
			button: ['内部生成', '取消测试'],
			css: [{
				test: true,
				n: true
			}, 'test', ['cjx']],
			stylesheet: [
				'background: red',
				{color: 'green'}
			],
			dialogData: {
				cjx: {
					cjx: ['好人一个', 'index']
				},
				test: 111
			}
		};
	},
	methods: {
		demo1: function demo1 () {
			var dialog = this.$dialog('我是demo1');
			window.demo1 = dialog;
		},
		demo2: function demo2 () {
			//  单文件.vue
			var dialog = this.$dialog({
				content: Content,
				method: 'prepend',
				contentData: this.dialogData,
				titleData: this.dialogData,
				title: '<span>{{dialogData.cjx.cjx[0]}}</span>',
				button: ['*关闭全部弹窗', '关闭全部弹窗']
			});
			dialog.onBtnClick(function (ret) {
				if (ret !== undefined && ret !== null) {
					this.$dialog.closeAll();
				}
			});
			window.demo2 = dialog;
		},
		demo3: function demo3 () {
			var dialog = this.$dialog({
				content: {
					template: '<div>我是demo3，我的content是一个对象，必须有template属性或者render函数，通vue初始化,template必须有根元素</div>'
				},
				method: 'prepend',
				title: 'demo3',
				button: ['*确定', '取消']
			});
			window.demo3 = dialog;
		},
		demo4: function demo4 () {
			//  单文件.vue
			var dialog = this.$dialog({
				content: {
					render: function render (createElement) {
						return createElement('div', {}, '我是demo4，我的content是一个对象，必须有template属性或者render函数，通vue初始化,template必须有根元素');
					}
				},
				title: 'demo4',
				button: ['*确定', '取消']
			});
			window.demo4 = dialog;
		},
		demo4_1: function demo4_1 () {
			var createElement = this.$createElement;
			var vnode = createElement('div', {}, ['我是demo4_1我的内容是一个传递进来的vnode']);
			//  单文件.vue
			var dialog = this.$dialog({
				content: vnode,
				method: 'prepend',
				title: 'demo4_1',
				button: ['*确定', '取消']
			});
			window.demo6 = dialog;
		},
		demo5: function demo5 () {
			//  单文件.vue
			var dialog = this.$dialog({
				content: '我是demo5，dialog的title和content的值可以通titleData和contentData传递<br>我是传递过来得值{{dialogData.cjx}}',
				method: 'prepend',
				contentData: this.dialogData,
				titleData: this.dialogData,
				title: '<span>{{dialogData.cjx.cjx[0]}}</span>',
				button: ['*确定', '取消']
			});
			window.demo5 = dialog;
		},
		demo6: function demo6 () {
			//  单文件.vue
			var dialog = this.$dialog({
				content: "\n\t\t\t\t\t我是demote6，通过 content()方法可以修改弹窗的内容哦\n\t\t\t\t\t<button data-action=\"btn\" data-ret=\"changeContent\">点击我可以修改弹窗的内容</button>\n\t\t\t\t",
				method: 'prepend',
				contentData: this.dialogData,
				titleData: this.dialogData,
				title: '<span>{{dialogData.cjx.cjx[0]}}</span>',
				button: ['*确定', '取消']
			});
			dialog.onBtnClick(function (ret) {
				if (ret === 'changeContent') {
					this.content('我是修改后得内容');
					return false;
				}
			});
			window.demo6 = dialog;
		},
		demo7: function demo7 () {
				//  单文件.vue
			var dialog = this.$dialog({
				content: "\n\t\t\t\t\t我是demote7，通过 title()方法可以修改弹窗的title哦\n\t\t\t\t\t<button data-action=\"btn\" data-ret=\"changeContent\">点击我可以修改弹窗的title</button>\n\t\t\t\t",
				method: 'prepend',
				title: '修改前title',
				button: ['*确定', '取消']
			});
			dialog.onBtnClick(function (ret) {
				if (ret === 'changeContent') {
					this.title('我是修改后得title');
					return false;
				}
			});
			window.demo7 = dialog;
		},
		demo8: function demo8 () {
			//  单文件.vue
			var dialog = this.$dialog({
				content: "\n\t\t\t\t\t我是demote8\n\t\t\t\t\t通过 position属性修改弹窗的位置哦<button data-action=\"btn\" data-ret=\"p\">点击我可以修改弹窗的\b位置</button><br>\n\t\t\t\t\t通过 width属性修改弹窗的宽度哦<button data-action=\"btn\" data-ret=\"w\">点击我可以修改弹窗的\b宽度</button><br>\n\t\t\t\t\t通过 height属性修改弹窗的高度哦<button data-action=\"btn\" data-ret=\"h\">点击我可以修改弹窗的\b高度</button><br>\n\t\t\t\t",
				title: 'demo8',
				button: ['*确定', '取消']
			});
			dialog.onBtnClick(function (ret) {
				if (ret === 'p') {
					this.position = 'lt';
					return false;
				} else if (ret === 'w') {
					this.width = 390;
					return false;
				} else if (ret === 'h') {
					this.height = '500px';
					return false;
				}
			});
			window.demo8 = dialog;
		},
		demo9: function demo9 () {
			this.$dialog({
				layout: false,
				content: '我是弹窗1',
				position: 'l'
			});
			this.$dialog({
				layout: 0,
				content: '我是弹窗2',
				position: 'c'
			});
			this.$dialog({
				layout: 0,
				content: '我是弹窗3',
				position: 'r'
			});
		},
		demo10: function demo10 () {
			this.demo2();
			this.demo1();
			this.demo3();
			this.demo2();
		},
		demo11: function demo11 () {
			var dialog = this.$dialog({
				content: {
					template: "<div>我是demo11<br>\n\t\t\t\t\t 通过animate属性可以修改dialog的动画效果目前有1-7，可以写1-7的任意整数数字开启动画，0表示没有动画</div>\n\t\t\t\t\t"
				},
				method: 'prepend',
				animate: 7,
				title: 'demo11',
				button: ['*确定', '取消']
			});
			window.demo11 = dialog;
		},
		demo12: function demo12 () {
			var dialog = this.$dialog({
				content:
				"我是demo12\n\t\t\t\t <br>主要是演示事件\n\t\t\t\t <br>事件有\n\t\t\t\t\t<br>beforeMount dialog 挂载前，同vue的beforeMount\n\t\t\t\t\t<br>mounted dialog 挂载后，通vue得mounted\n\t\t\t\t\t<br>show dialog显示时候调用，每次显示都会调用\n\t\t\t\t\t<br>hide hide dialog隐藏时候调用\n\t\t\t\t\t<br>btnClick [ret] dialog上的按钮点击的时候调用，返回参数有 ret标记，表明每个按钮点击时候调用的标记,\n\t\t\t\t\t<br>\t\t\t\t\tret 可以通过全局配置修改，自定义按钮携带 data-action='btn'的将会触发该事件data-ret可以自定义返回标志\n\t\t\t\t\t<br>beforeClose dialog关闭前调用，任意一个返回false则会终止dialog关闭\n\t\t\t\t\t<br>close dialog关闭前调用，这个时候dom还存在，但是关闭已经触发，无法返回了\n\t\t\t\t\t<br>closed dialog 已经关闭啥都没有了，dom已经删除\n\t\t\t\t\t<br>事件调用有2种方法，一种通过 vm.$on实现，另一种通过暴露的method实现\n\t\t\t\t\t<br>请看 console控制台输出\n\t\t\t\t",
				title: 'demo-事件处理',
				animate: 2,
				button: ['*确定', '取消']
			});
			window.demo12 = dialog;
			dialog.onBeforeMount(function () {
				console.log('beforeMount事件被调用了');
			});
			dialog.onMounted(function () {
				console.log('mounted事件被调用了');
			});
			dialog.onShow(function () {
				console.log('show事件被调用了');
			});
			dialog.onHide(function () {
				console.log('hide事件被调用了');
			});
			dialog.onClose(function () {
				console.log('close事件被调用了');
			});
			dialog.onClosed(function (ret) {
				console.log('closed事件被调用了', ret);
			});
			dialog.onBeforeClose(function (ret) {
				console.log('beforeClose事件被调用了', ret);
				// false返回可以阻止dialog关闭
				// return false;
			});
			dialog.onBtnClick(function (ret) {
				console.log('btnClick事件被调用了', ret);
				// false返回可以阻止dialog关闭
				// return false;
			});
		},
		demo13: function demo13 () {
			var dialog = this.$dialog({
				content: "\n\t\t\t\t\t我是demote13，通过 dialog.conf可以修改dialog的一些全局配置<br>\n\t\t\t\t\t// 单字符样式映射<br>\n\t\t\t\t\tbtnCssMap: {<br>\n\t\t\t\t\t\tdef: 'es-dialog-btn',<br>\n\t\t\t\t\t\t'*': 'es-dialog-focus-btn'<br>\n\t\t\t\t\t},<br>\n\t\t\t\t\t// 按钮retId编码方法<br>\n\t\t\t\t\tgetBtnRetId: function (i, n) {<br>\n\t\t\t\t\t\treturn n > 1 ? n - i - 1 : 1;<br>\n\t\t\t\t\t}<br>\n\t\t\t\t",
				method: 'prepend',
				title: 'demo13',
				button: ['*确定', '取消']
			});
			window.demo13 = dialog;
		},
		demo14: function demo14 () {
			this.$dialog({
				content: '我可以自动关闭',
				title: '',
				animate: 3,
				timeout: 3000
			});
		},
		demo15: function demo15 () {
			this.$alert('我是alert', function (ret) {
				console.log('按钮被点击了。。。。。。', ret);
			});
		},
		demo16: function demo16 () {
			this.$confirm('我是confirm', function (ret) {
				console.log('按钮被点击了。。。。。。', ret);
			});
		},
		demo17: function demo17 () {
			this.$toast('我是toast', 3000, function (ret) {
				console.log('toast关闭', ret);
			});

			this.$error('我是error', function (ret) {
				console.log('error关闭', ret);
			});
		}
	}
};

var demo = new Vue({
	el: '#app',
	render: function render (h) {
		return h(demo$1);
	}
});
window.Vue = Vue;

exports['default'] = demo;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=demo.js.map
