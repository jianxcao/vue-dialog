var demo = (function (exports, Vue) {
	'use strict';

	Vue = Vue && Vue.hasOwnProperty('default') ? Vue['default'] : Vue;

	//
	//
	//
	//
	//
	//
	//
	//
	//
	//

	var child = {
		template: '<em>我是子节点</em>'
	};
	window.child = child;
	var script = {
		data: function data () {
			return {
				ccc: 'ccc'
			};
		},
		created: function created () {
			console.log('created-content');
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

	function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
	/* server only */
	, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
	  if (typeof shadowMode !== 'boolean') {
	    createInjectorSSR = createInjector;
	    createInjector = shadowMode;
	    shadowMode = false;
	  } // Vue.extend constructor export interop.


	  var options = typeof script === 'function' ? script.options : script; // render functions

	  if (template && template.render) {
	    options.render = template.render;
	    options.staticRenderFns = template.staticRenderFns;
	    options._compiled = true; // functional template

	    if (isFunctionalTemplate) {
	      options.functional = true;
	    }
	  } // scopedId


	  if (scopeId) {
	    options._scopeId = scopeId;
	  }

	  var hook;

	  if (moduleIdentifier) {
	    // server build
	    hook = function hook(context) {
	      // 2.3 injection
	      context = context || // cached call
	      this.$vnode && this.$vnode.ssrContext || // stateful
	      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
	      // 2.2 with runInNewContext: true

	      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
	        context = __VUE_SSR_CONTEXT__;
	      } // inject component styles


	      if (style) {
	        style.call(this, createInjectorSSR(context));
	      } // register component module identifier for async chunk inference


	      if (context && context._registeredComponents) {
	        context._registeredComponents.add(moduleIdentifier);
	      }
	    }; // used by ssr in case component is cached and beforeCreate
	    // never gets called


	    options._ssrRegister = hook;
	  } else if (style) {
	    hook = shadowMode ? function () {
	      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
	    } : function (context) {
	      style.call(this, createInjector(context));
	    };
	  }

	  if (hook) {
	    if (options.functional) {
	      // register for functional component in vue file
	      var originalRender = options.render;

	      options.render = function renderWithStyleInjection(h, context) {
	        hook.call(context);
	        return originalRender(h, context);
	      };
	    } else {
	      // inject component registration as beforeCreate hook
	      var existing = options.beforeCreate;
	      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
	    }
	  }

	  return script;
	}

	var normalizeComponent_1 = normalizeComponent;

	/* script */
	var __vue_script__ = script;

	/* template */
	var __vue_render__ = function() {
	  var _vm = this;
	  var _h = _vm.$createElement;
	  var _c = _vm._self._c || _h;
	  return _c(
	    "div",
	    { staticClass: "inner", attrs: { "data-test": "1111" } },
	    [
	      _vm._v(
	        "\n\t我是demo2，我的内容是一个单vue文件，数据是从属性 contentData属性获取"
	      ),
	      _c("br"),
	      _vm._v(
	        "\n\t" +
	          _vm._s(_vm.ccc) +
	          _vm._s(_vm.dialogData.cjx.cjx) +
	          " " +
	          _vm._s(_vm.dialogData.test) +
	          "\n\t"
	      ),
	      _c("child", [_vm._v("test")]),
	      _vm._v(" "),
	      _c("button", { on: { click: _vm.changeT } }, [_vm._v("修改test")]),
	      _c("br"),
	      _vm._v(" "),
	      _c("button", { on: { click: _vm.ff } }, [_vm._v("修改cjx")])
	    ],
	    1
	  )
	};
	var __vue_staticRenderFns__ = [];
	__vue_render__._withStripped = true;

	  /* style */
	  var __vue_inject_styles__ = undefined;
	  /* scoped */
	  var __vue_scope_id__ = undefined;
	  /* module identifier */
	  var __vue_module_identifier__ = undefined;
	  /* functional template */
	  var __vue_is_functional_template__ = false;
	  /* style inject */
	  
	  /* style inject SSR */
	  

	  
	  var Content = normalizeComponent_1(
	    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
	    __vue_inject_styles__,
	    __vue_script__,
	    __vue_scope_id__,
	    __vue_is_functional_template__,
	    __vue_module_identifier__,
	    undefined,
	    undefined
	  );

	//
	//
	//
	//
	//
	//

	var script$1 = {
		methods: {
			ff: function ff () {
				this.cjx.cjx = 'cjx' + Math.random();
			},
			changeT: function changeT () {
				this.test = Math.random();
			}
		}
	};

	var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
	function createInjector(context) {
	  return function (id, style) {
	    return addStyle(id, style);
	  };
	}
	var HEAD = document.head || document.getElementsByTagName('head')[0];
	var styles = {};

	function addStyle(id, css) {
	  var group = isOldIE ? css.media || 'default' : id;
	  var style = styles[group] || (styles[group] = {
	    ids: new Set(),
	    styles: []
	  });

	  if (!style.ids.has(id)) {
	    style.ids.add(id);
	    var code = css.source;

	    if (css.map) {
	      // https://developer.chrome.com/devtools/docs/javascript-debugging
	      // this makes source maps inside style tags work properly in Chrome
	      code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

	      code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
	    }

	    if (!style.element) {
	      style.element = document.createElement('style');
	      style.element.type = 'text/css';
	      if (css.media) { style.element.setAttribute('media', css.media); }
	      HEAD.appendChild(style.element);
	    }

	    if ('styleSheet' in style.element) {
	      style.styles.push(code);
	      style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
	    } else {
	      var index = style.ids.size - 1;
	      var textNode = document.createTextNode(code);
	      var nodes = style.element.childNodes;
	      if (nodes[index]) { style.element.removeChild(nodes[index]); }
	      if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }else { style.element.appendChild(textNode); }
	    }
	  }
	}

	var browser = createInjector;

	/* script */
	var __vue_script__$1 = script$1;

	/* template */
	var __vue_render__$1 = function() {
	  var _vm = this;
	  var _h = _vm.$createElement;
	  var _c = _vm._self._c || _h;
	  return _vm._m(0)
	};
	var __vue_staticRenderFns__$1 = [
	  function() {
	    var _vm = this;
	    var _h = _vm.$createElement;
	    var _c = _vm._self._c || _h;
	    return _c("div", { staticClass: "input-test" }, [
	      _c("input", { attrs: { type: "text", name: "test" } }),
	      _vm._v(" "),
	      _c("textarea", { attrs: { rows: "", cols: "" } }, [_vm._v("我是test")])
	    ])
	  }
	];
	__vue_render__$1._withStripped = true;

	  /* style */
	  var __vue_inject_styles__$1 = function (inject) {
	    if (!inject) { return }
	    inject("data-v-2ab16019_0", { source: "\n.input-test {\n\tpadding-bottom: 2px;\n}\ninput, textarea{\n\tborder: 1px solid #aaa;\n\twidth: 100%;\n\tfont-size: 1.5rem;\n\t-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n\toutline: none;\n\tline-height: 1;\n}\n", map: {"version":3,"sources":["/Users/jxcao/project/gitWork/vue-dialog/examples/mobile/input.vue"],"names":[],"mappings":";AAmBA;CACA,mBAAA;AACA;AACA;CACA,sBAAA;CACA,WAAA;CACA,iBAAA;CACA,6CAAA;CACA,aAAA;CACA,cAAA;AACA","file":"input.vue","sourcesContent":["<template>\n\t<div class=\"input-test\">\n\t\t<input type=\"text\" name=\"test\">\n\t\t<textarea rows=\"\" cols=\"\">我是test</textarea>\n\t</div>\n</template>\n<script>\n\texport default {\n\t\tmethods: {\n\t\t\tff () {\n\t\t\t\tthis.cjx.cjx = 'cjx' + Math.random();\n\t\t\t},\n\t\t\tchangeT () {\n\t\t\t\tthis.test = Math.random();\n\t\t\t}\n\t\t}\n\t};\n</script>\n<style>\n.input-test {\n\tpadding-bottom: 2px;\n}\ninput, textarea{\n\tborder: 1px solid #aaa;\n\twidth: 100%;\n\tfont-size: 1.5rem;\n\t-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n\toutline: none;\n\tline-height: 1;\n}\n</style>\n"]}, media: undefined });

	  };
	  /* scoped */
	  var __vue_scope_id__$1 = undefined;
	  /* module identifier */
	  var __vue_module_identifier__$1 = undefined;
	  /* functional template */
	  var __vue_is_functional_template__$1 = false;
	  /* style inject SSR */
	  

	  
	  var Input = normalizeComponent_1(
	    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
	    __vue_inject_styles__$1,
	    __vue_script__$1,
	    __vue_scope_id__$1,
	    __vue_is_functional_template__$1,
	    __vue_module_identifier__$1,
	    browser,
	    undefined
	  );

	//
	var script$2 = {
		data: function data () {
			return {
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
				// let vm = this;
				window.setTimeout(function () {
					// dialog.close();
				}, 3);
			},
			demo2: function demo2 () {
				// let c = Content._Ctor[0];
				//  单文件.vue
				var dialog = this.$dialog({
					content: Content,
					method: 'prepend',
					animate: 3,
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
					animate: 1,
					title: 'demo11',
					button: ['*确定', '取消']
				});
				window.demo11 = dialog;
			},
			demo12: function demo12 () {
				var dialog = this.$dialog({
					height: '30rem',
					content:
					"<div class=\"demo12\">我是demo12\n\t\t\t\t <br>主要是演示事件\n\t\t\t\t <br>事件有\n\t\t\t\t\t<br>beforeMount dialog 挂载前，同vue的beforeMount\n\t\t\t\t\t<br>mounted dialog 挂载后，通vue得mounted\n\t\t\t\t\t<br>show dialog显示时候调用，每次显示都会调用\n\t\t\t\t\t<br>hide hide dialog隐藏时候调用\n\t\t\t\t\t<br>btnClick [ret] dialog上的按钮点击的时候调用，返回参数有 ret标记，表明每个按钮点击时候调用的标记,\n\t\t\t\t\t<br>\t\t\t\t\tret 可以通过全局配置修改，自定义按钮携带 data-action='btn'的将会触发该事件data-ret可以自定义返回标志\n\t\t\t\t\t<br>beforeClose dialog关闭前调用，任意一个返回false则会终止dialog关闭\n\t\t\t\t\t<br>close dialog关闭前调用，这个时候dom还存在，但是关闭已经触发，无法返回了\n\t\t\t\t\t<br>closed dialog 已经关闭啥都没有了，dom已经删除\n\t\t\t\t\t<br>事件调用有2种方法，一种通过 vm.$on实现，另一种通过暴露的method实现\n\t\t\t\t\t<br>请看 console控制台输出</div>\n\t\t\t\t",
					title: 'demo-事件处理',
					animate: 0,
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
				this.$dialog.alert('我是alert', function (ret) {
					console.log('按钮被点击了。。。。。。', ret);
				});
			},
			demo16: function demo16 () {
				this.$dialog.confirm('我是confirm', function (ret) {
					console.log('按钮被点击了。。。。。。', ret);
				});
			},
			demo17: function demo17 () {
				this.$dialog.toast('我是toast', 30000, function (ret) {
					console.log('toast关闭', ret);
				})
				.onShow(function () {
					// alert(this.$refs.dialog.offsetHeight);
				});
			},
			demo18: function demo18 () {
				var dialog = this.$dialog({
					content: {
						template: "<div>我是demo11<br>\n\t\t\t\t\t 自定义动画测试哦\n\t\t\t\t\t"
					},
					class: 'm-test-dialog',
					method: 'prepend',
					animate: 11,
					position: 'b',
					title: 'demo18',
					button: ['*确定', '取消']
				});
				window.demo18 = dialog;
			},
			demo19: function demo19 () {
				//  单文件.vue
				var dialog = this.$dialog({
					content: Input,
					class: 'm-test-dialog',
					title: 'input测试',
					animate: 0,
					// position: function () {
					// 	let dialog = this.$refs.dialog;
					// 	let pos = dialog.getBoundingClientRect();
					// 	return {
					// 		top: '100%',
					// 		left: 0,
					// 		marginTop: '-' + pos.height + 'px'
					// 	};
					// },
					position: 'c',
					width: '100%',
					lockIosHeight: true,
					button: ['确定', '取消']
				});
				window.demo19 = dialog;
			}
		}
	};

	/* script */
	var __vue_script__$2 = script$2;

	/* template */
	var __vue_render__$2 = function() {
	  var _vm = this;
	  var _h = _vm.$createElement;
	  var _c = _vm._self._c || _h;
	  return _c("div", [
	    _vm._v("\n\tdialog demo "),
	    _c("br"),
	    _vm._v(" "),
	    _c("button", { attrs: { type: "button" }, on: { click: _vm.demo1 } }, [
	      _vm._v("打开一个普通弹窗")
	    ]),
	    _vm._v(" "),
	    _c("button", { attrs: { type: "button" }, on: { click: _vm.demo2 } }, [
	      _vm._v("弹窗内容是 .Vue单文件")
	    ]),
	    _vm._v(" "),
	    _c("button", { attrs: { type: "button" }, on: { click: _vm.demo3 } }, [
	      _vm._v('弹窗内容是 {template: "..."}')
	    ]),
	    _vm._v(" "),
	    _c("button", { attrs: { type: "button" }, on: { click: _vm.demo4 } }, [
	      _vm._v("弹窗内容是 {render: () => {}}")
	    ]),
	    _vm._v(" "),
	    _c("button", { attrs: { type: "button" }, on: { click: _vm.demo4_1 } }, [
	      _vm._v("弹窗内容是 Vnode")
	    ]),
	    _vm._v(" "),
	    _c("button", { attrs: { type: "button" }, on: { click: _vm.demo5 } }, [
	      _vm._v("弹窗值传递")
	    ]),
	    _vm._v(" "),
	    _c("button", { attrs: { type: "button" }, on: { click: _vm.demo6 } }, [
	      _vm._v("修改弹窗内容")
	    ]),
	    _vm._v(" "),
	    _c("button", { attrs: { type: "button" }, on: { click: _vm.demo7 } }, [
	      _vm._v("修改弹窗title")
	    ]),
	    _vm._v(" "),
	    _c("button", { attrs: { type: "button" }, on: { click: _vm.demo8 } }, [
	      _vm._v("修改dialog高度，宽度，位置")
	    ]),
	    _vm._v(" "),
	    _c("button", { attrs: { type: "button" }, on: { click: _vm.demo9 } }, [
	      _vm._v("打开多个非模态窗口")
	    ]),
	    _vm._v(" "),
	    _c("button", { attrs: { type: "button" }, on: { click: _vm.demo10 } }, [
	      _vm._v("打开多个模态窗口")
	    ]),
	    _vm._v(" "),
	    _c("button", { attrs: { type: "button" }, on: { click: _vm.demo11 } }, [
	      _vm._v("动画设置")
	    ]),
	    _vm._v(" "),
	    _c("button", { attrs: { type: "button" }, on: { click: _vm.demo12 } }, [
	      _vm._v("dialog事件演示")
	    ]),
	    _vm._v(" "),
	    _c("button", { attrs: { type: "button" }, on: { click: _vm.demo13 } }, [
	      _vm._v("dialog全局设置")
	    ]),
	    _vm._v(" "),
	    _c("button", { attrs: { type: "button" }, on: { click: _vm.demo14 } }, [
	      _vm._v("dialog自动关闭")
	    ]),
	    _vm._v(" "),
	    _c("button", { attrs: { type: "button" }, on: { click: _vm.demo15 } }, [
	      _vm._v("dialog alert接口")
	    ]),
	    _vm._v(" "),
	    _c("button", { attrs: { type: "button" }, on: { click: _vm.demo16 } }, [
	      _vm._v("dialog confirm接口")
	    ]),
	    _vm._v(" "),
	    _c("button", { attrs: { type: "button" }, on: { click: _vm.demo17 } }, [
	      _vm._v("dialog toast接口")
	    ]),
	    _vm._v(" "),
	    _c("button", { attrs: { type: "button" }, on: { click: _vm.demo18 } }, [
	      _vm._v("自定义动画")
	    ]),
	    _vm._v(" "),
	    _c("button", { attrs: { type: "button" }, on: { click: _vm.demo19 } }, [
	      _vm._v("input框测试")
	    ]),
	    _vm._v(" "),
	    _c("div", { attrs: { id: "console" } }),
	    _vm._v(" "),
	    _c(
	      "ul",
	      _vm._l(50, function(n) {
	        return _c("li", [
	          _vm._v("列表测试" + _vm._s(n) + "-" + _vm._s(Math.random()))
	        ])
	      }),
	      0
	    )
	  ])
	};
	var __vue_staticRenderFns__$2 = [];
	__vue_render__$2._withStripped = true;

	  /* style */
	  var __vue_inject_styles__$2 = function (inject) {
	    if (!inject) { return }
	    inject("data-v-936e3650_0", { source: "\nbody {\n\tmargin: 0px;\n}\nbutton {\n\tdisplay: block;\n\tborder:1px solid #e5e5e5;\n\tbackground-color: #fdfdfd;\n\tpadding: 10px;\n\tmargin: 5px;\n\tcolor:#0076ff;\n}\n\t/*自定义dialog动画*/\n.m-test-dialog.es-dialog-ani-11{\n\ttransform: translate(0px, 100%);\n}\n.m-test-dialog.es-dialog.es-ani-show, .m-test-dialog.es-ani-hide{\n\ttransition: all .3s linear;\n}\n", map: {"version":3,"sources":["/Users/jxcao/project/gitWork/vue-dialog/examples/mobile/demo.vue"],"names":[],"mappings":";AAsXA;CACA,WAAA;AACA;AACA;CACA,cAAA;CACA,wBAAA;CACA,yBAAA;CACA,aAAA;CACA,WAAA;CACA,aAAA;AACA;CACA,cAAA;AACA;CACA,+BAAA;AACA;AACA;CACA,0BAAA;AACA","file":"demo.vue","sourcesContent":["<template>\n\t<div>\n\t\tdialog demo <br>\n\t\t<button type=\"button\" @click=\"demo1\">打开一个普通弹窗</button>\n\t\t<button type=\"button\" @click=\"demo2\">弹窗内容是 .Vue单文件</button>\n\t\t<button type=\"button\" @click=\"demo3\">弹窗内容是 {template: \"...\"}</button>\n\t\t<button type=\"button\" @click=\"demo4\">弹窗内容是 {render: () => {}}</button>\n\t\t<button type=\"button\" @click=\"demo4_1\">弹窗内容是 Vnode</button>\n\t\t<button type=\"button\" @click=\"demo5\">弹窗值传递</button>\n\t\t<button type=\"button\" @click=\"demo6\">修改弹窗内容</button>\n\t\t<button type=\"button\" @click=\"demo7\">修改弹窗title</button>\n\t\t<button type=\"button\" @click=\"demo8\">修改dialog高度，宽度，位置</button>\n\t\t<button type=\"button\" @click=\"demo9\">打开多个非模态窗口</button>\n\t\t<button type=\"button\" @click=\"demo10\">打开多个模态窗口</button>\n\t\t<button type=\"button\" @click=\"demo11\">动画设置</button>\n\t\t<button type=\"button\" @click=\"demo12\">dialog事件演示</button>\n\t\t<button type=\"button\" @click=\"demo13\">dialog全局设置</button>\n\t\t<button type=\"button\" @click=\"demo14\">dialog自动关闭</button>\n\t\t<button type=\"button\" @click=\"demo15\">dialog alert接口</button>\n\t\t<button type=\"button\" @click=\"demo16\">dialog confirm接口</button>\n\t\t<button type=\"button\" @click=\"demo17\">dialog toast接口</button>\n\t\t<button type=\"button\" @click=\"demo18\">自定义动画</button>\n\t\t<button type=\"button\" @click=\"demo19\">input框测试</button>\n\t\t<div id=\"console\">\n\t\t</div>\n\t\t<ul>\n\t\t\t<li v-for=\"n in 50\">列表测试{{n}}-{{Math.random()}}</li>\n\t\t</ul>\n\t</div>\n</template>\n<script>\nimport Content from './content.vue';\nimport Input from './input.vue';\nexport default {\n\tdata () {\n\t\treturn {\n\t\t\tcss: [{\n\t\t\t\ttest: true,\n\t\t\t\tn: true\n\t\t\t}, 'test', ['cjx']],\n\t\t\tstylesheet: [\n\t\t\t\t'background: red',\n\t\t\t\t{color: 'green'}\n\t\t\t],\n\t\t\tdialogData: {\n\t\t\t\tcjx: {\n\t\t\t\t\tcjx: ['好人一个', 'index']\n\t\t\t\t},\n\t\t\t\ttest: 111\n\t\t\t}\n\t\t};\n\t},\n\tmethods: {\n\t\tdemo1 () {\n\t\t\tlet dialog = this.$dialog('我是demo1');\n\t\t\twindow.demo1 = dialog;\n\t\t\t// let vm = this;\n\t\t\twindow.setTimeout(function () {\n\t\t\t\t// dialog.close();\n\t\t\t}, 3);\n\t\t},\n\t\tdemo2 () {\n\t\t\t// let c = Content._Ctor[0];\n\t\t\t//  单文件.vue\n\t\t\tlet dialog = this.$dialog({\n\t\t\t\tcontent: Content,\n\t\t\t\tmethod: 'prepend',\n\t\t\t\tanimate: 3,\n\t\t\t\tcontentData: this.dialogData,\n\t\t\t\ttitleData: this.dialogData,\n\t\t\t\ttitle: '<span>{{dialogData.cjx.cjx[0]}}</span>',\n\t\t\t\tbutton: ['*关闭全部弹窗', '关闭全部弹窗']\n\t\t\t});\n\t\t\tdialog.onBtnClick(function (ret) {\n\t\t\t\tif (ret !== undefined && ret !== null) {\n\t\t\t\t\tthis.$dialog.closeAll();\n\t\t\t\t}\n\t\t\t});\n\t\t\twindow.demo2 = dialog;\n\t\t},\n\t\tdemo3 () {\n\t\t\tlet dialog = this.$dialog({\n\t\t\t\tcontent: {\n\t\t\t\t\ttemplate: '<div>我是demo3，我的content是一个对象，必须有template属性或者render函数，通vue初始化,template必须有根元素</div>'\n\t\t\t\t},\n\t\t\t\tmethod: 'prepend',\n\t\t\t\ttitle: 'demo3',\n\t\t\t\tbutton: ['*确定', '取消']\n\t\t\t});\n\t\t\twindow.demo3 = dialog;\n\t\t},\n\t\tdemo4 () {\n\t\t\t//  单文件.vue\n\t\t\tlet dialog = this.$dialog({\n\t\t\t\tcontent: {\n\t\t\t\t\trender (createElement) {\n\t\t\t\t\t\treturn createElement('div', {}, '我是demo4，我的content是一个对象，必须有template属性或者render函数，通vue初始化,template必须有根元素');\n\t\t\t\t\t}\n\t\t\t\t},\n\t\t\t\ttitle: 'demo4',\n\t\t\t\tbutton: ['*确定', '取消']\n\t\t\t});\n\t\t\twindow.demo4 = dialog;\n\t\t},\n\t\tdemo4_1 () {\n\t\t\tlet createElement = this.$createElement;\n\t\t\tlet vnode = createElement('div', {}, ['我是demo4_1我的内容是一个传递进来的vnode']);\n\t\t\t//  单文件.vue\n\t\t\tlet dialog = this.$dialog({\n\t\t\t\tcontent: vnode,\n\t\t\t\tmethod: 'prepend',\n\t\t\t\ttitle: 'demo4_1',\n\t\t\t\tbutton: ['*确定', '取消']\n\t\t\t});\n\t\t\twindow.demo6 = dialog;\n\t\t},\n\t\tdemo5 () {\n\t\t\t//  单文件.vue\n\t\t\tlet dialog = this.$dialog({\n\t\t\t\tcontent: '我是demo5，dialog的title和content的值可以通titleData和contentData传递<br>我是传递过来得值{{dialogData.cjx}}',\n\t\t\t\tmethod: 'prepend',\n\t\t\t\tcontentData: this.dialogData,\n\t\t\t\ttitleData: this.dialogData,\n\t\t\t\ttitle: '<span>{{dialogData.cjx.cjx[0]}}</span>',\n\t\t\t\tbutton: ['*确定', '取消']\n\t\t\t});\n\t\t\twindow.demo5 = dialog;\n\t\t},\n\t\tdemo6 () {\n\t\t\t//  单文件.vue\n\t\t\tlet dialog = this.$dialog({\n\t\t\t\tcontent: `\n\t\t\t\t\t我是demote6，通过 content()方法可以修改弹窗的内容哦\n\t\t\t\t\t<button data-action=\"btn\" data-ret=\"changeContent\">点击我可以修改弹窗的内容</button>\n\t\t\t\t`,\n\t\t\t\tmethod: 'prepend',\n\t\t\t\tcontentData: this.dialogData,\n\t\t\t\ttitleData: this.dialogData,\n\t\t\t\ttitle: '<span>{{dialogData.cjx.cjx[0]}}</span>',\n\t\t\t\tbutton: ['*确定', '取消']\n\t\t\t});\n\t\t\tdialog.onBtnClick(function (ret) {\n\t\t\t\tif (ret === 'changeContent') {\n\t\t\t\t\tthis.content('我是修改后得内容');\n\t\t\t\t\treturn false;\n\t\t\t\t}\n\t\t\t});\n\t\t\twindow.demo6 = dialog;\n\t\t},\n\t\tdemo7 () {\n\t\t\t\t//  单文件.vue\n\t\t\tlet dialog = this.$dialog({\n\t\t\t\tcontent: `\n\t\t\t\t\t我是demote7，通过 title()方法可以修改弹窗的title哦\n\t\t\t\t\t<button data-action=\"btn\" data-ret=\"changeContent\">点击我可以修改弹窗的title</button>\n\t\t\t\t`,\n\t\t\t\tmethod: 'prepend',\n\t\t\t\ttitle: '修改前title',\n\t\t\t\tbutton: ['*确定', '取消']\n\t\t\t});\n\t\t\tdialog.onBtnClick(function (ret) {\n\t\t\t\tif (ret === 'changeContent') {\n\t\t\t\t\tthis.title('我是修改后得title');\n\t\t\t\t\treturn false;\n\t\t\t\t}\n\t\t\t});\n\t\t\twindow.demo7 = dialog;\n\t\t},\n\t\tdemo8 () {\n\t\t\t//  单文件.vue\n\t\t\tlet dialog = this.$dialog({\n\t\t\t\tcontent: `\n\t\t\t\t\t我是demote8\n\t\t\t\t\t通过 position属性修改弹窗的位置哦<button data-action=\"btn\" data-ret=\"p\">点击我可以修改弹窗的\b位置</button><br>\n\t\t\t\t\t通过 width属性修改弹窗的宽度哦<button data-action=\"btn\" data-ret=\"w\">点击我可以修改弹窗的\b宽度</button><br>\n\t\t\t\t\t通过 height属性修改弹窗的高度哦<button data-action=\"btn\" data-ret=\"h\">点击我可以修改弹窗的\b高度</button><br>\n\t\t\t\t`,\n\t\t\t\ttitle: 'demo8',\n\t\t\t\tbutton: ['*确定', '取消']\n\t\t\t});\n\t\t\tdialog.onBtnClick(function (ret) {\n\t\t\t\tif (ret === 'p') {\n\t\t\t\t\tthis.position = 'lt';\n\t\t\t\t\treturn false;\n\t\t\t\t} else if (ret === 'w') {\n\t\t\t\t\tthis.width = 390;\n\t\t\t\t\treturn false;\n\t\t\t\t} else if (ret === 'h') {\n\t\t\t\t\tthis.height = '500px';\n\t\t\t\t\treturn false;\n\t\t\t\t}\n\t\t\t});\n\t\t\twindow.demo8 = dialog;\n\t\t},\n\t\tdemo9 () {\n\t\t\tthis.$dialog({\n\t\t\t\tlayout: false,\n\t\t\t\tcontent: '我是弹窗1',\n\t\t\t\tposition: 'l'\n\t\t\t});\n\t\t\tthis.$dialog({\n\t\t\t\tlayout: 0,\n\t\t\t\tcontent: '我是弹窗2',\n\t\t\t\tposition: 'c'\n\t\t\t});\n\t\t\tthis.$dialog({\n\t\t\t\tlayout: 0,\n\t\t\t\tcontent: '我是弹窗3',\n\t\t\t\tposition: 'r'\n\t\t\t});\n\t\t},\n\t\tdemo10 () {\n\t\t\tthis.demo2();\n\t\t\tthis.demo1();\n\t\t\tthis.demo3();\n\t\t\tthis.demo2();\n\t\t},\n\t\tdemo11 () {\n\t\t\tlet dialog = this.$dialog({\n\t\t\t\tcontent: {\n\t\t\t\t\ttemplate: `<div>我是demo11<br>\n\t\t\t\t\t 通过animate属性可以修改dialog的动画效果目前有1-7，可以写1-7的任意整数数字开启动画，0表示没有动画</div>\n\t\t\t\t\t`\n\t\t\t\t},\n\t\t\t\tmethod: 'prepend',\n\t\t\t\tanimate: 1,\n\t\t\t\ttitle: 'demo11',\n\t\t\t\tbutton: ['*确定', '取消']\n\t\t\t});\n\t\t\twindow.demo11 = dialog;\n\t\t},\n\t\tdemo12 () {\n\t\t\tlet dialog = this.$dialog({\n\t\t\t\theight: '30rem',\n\t\t\t\tcontent:\n\t\t\t\t`<div class=\"demo12\">我是demo12\n\t\t\t\t <br>主要是演示事件\n\t\t\t\t <br>事件有\n\t\t\t\t\t<br>beforeMount dialog 挂载前，同vue的beforeMount\n\t\t\t\t\t<br>mounted dialog 挂载后，通vue得mounted\n\t\t\t\t\t<br>show dialog显示时候调用，每次显示都会调用\n\t\t\t\t\t<br>hide hide dialog隐藏时候调用\n\t\t\t\t\t<br>btnClick [ret] dialog上的按钮点击的时候调用，返回参数有 ret标记，表明每个按钮点击时候调用的标记,\n\t\t\t\t\t<br>\t\t\t\t\tret 可以通过全局配置修改，自定义按钮携带 data-action='btn'的将会触发该事件data-ret可以自定义返回标志\n\t\t\t\t\t<br>beforeClose dialog关闭前调用，任意一个返回false则会终止dialog关闭\n\t\t\t\t\t<br>close dialog关闭前调用，这个时候dom还存在，但是关闭已经触发，无法返回了\n\t\t\t\t\t<br>closed dialog 已经关闭啥都没有了，dom已经删除\n\t\t\t\t\t<br>事件调用有2种方法，一种通过 vm.$on实现，另一种通过暴露的method实现\n\t\t\t\t\t<br>请看 console控制台输出</div>\n\t\t\t\t`,\n\t\t\t\ttitle: 'demo-事件处理',\n\t\t\t\tanimate: 0,\n\t\t\t\tbutton: ['*确定', '取消']\n\t\t\t});\n\t\t\twindow.demo12 = dialog;\n\t\t\tdialog.onBeforeMount(function () {\n\t\t\t\tconsole.log('beforeMount事件被调用了');\n\t\t\t});\n\t\t\tdialog.onMounted(function () {\n\t\t\t\tconsole.log('mounted事件被调用了');\n\t\t\t});\n\t\t\tdialog.onShow(function () {\n\t\t\t\tconsole.log('show事件被调用了');\n\t\t\t});\n\t\t\tdialog.onHide(function () {\n\t\t\t\tconsole.log('hide事件被调用了');\n\t\t\t});\n\t\t\tdialog.onClose(function () {\n\t\t\t\tconsole.log('close事件被调用了');\n\t\t\t});\n\t\t\tdialog.onClosed(function (ret) {\n\t\t\t\tconsole.log('closed事件被调用了', ret);\n\t\t\t});\n\t\t\tdialog.onBeforeClose(function (ret) {\n\t\t\t\tconsole.log('beforeClose事件被调用了', ret);\n\t\t\t\t// false返回可以阻止dialog关闭\n\t\t\t\t// return false;\n\t\t\t});\n\t\t\tdialog.onBtnClick(function (ret) {\n\t\t\t\tconsole.log('btnClick事件被调用了', ret);\n\t\t\t\t// false返回可以阻止dialog关闭\n\t\t\t\t// return false;\n\t\t\t});\n\t\t},\n\t\tdemo13 () {\n\t\t\tlet dialog = this.$dialog({\n\t\t\t\tcontent: `\n\t\t\t\t\t我是demote13，通过 dialog.conf可以修改dialog的一些全局配置<br>\n\t\t\t\t\t// 单字符样式映射<br>\n\t\t\t\t\tbtnCssMap: {<br>\n\t\t\t\t\t\tdef: 'es-dialog-btn',<br>\n\t\t\t\t\t\t'*': 'es-dialog-focus-btn'<br>\n\t\t\t\t\t},<br>\n\t\t\t\t\t// 按钮retId编码方法<br>\n\t\t\t\t\tgetBtnRetId: function (i, n) {<br>\n\t\t\t\t\t\treturn n > 1 ? n - i - 1 : 1;<br>\n\t\t\t\t\t}<br>\n\t\t\t\t`,\n\t\t\t\tmethod: 'prepend',\n\t\t\t\ttitle: 'demo13',\n\t\t\t\tbutton: ['*确定', '取消']\n\t\t\t});\n\t\t\twindow.demo13 = dialog;\n\t\t},\n\t\tdemo14 () {\n\t\t\tthis.$dialog({\n\t\t\t\tcontent: '我可以自动关闭',\n\t\t\t\ttitle: '',\n\t\t\t\tanimate: 3,\n\t\t\t\ttimeout: 3000\n\t\t\t});\n\t\t},\n\t\tdemo15 () {\n\t\t\tthis.$dialog.alert('我是alert', function (ret) {\n\t\t\t\tconsole.log('按钮被点击了。。。。。。', ret);\n\t\t\t});\n\t\t},\n\t\tdemo16 () {\n\t\t\tthis.$dialog.confirm('我是confirm', function (ret) {\n\t\t\t\tconsole.log('按钮被点击了。。。。。。', ret);\n\t\t\t});\n\t\t},\n\t\tdemo17 () {\n\t\t\tthis.$dialog.toast('我是toast', 30000, function (ret) {\n\t\t\t\tconsole.log('toast关闭', ret);\n\t\t\t})\n\t\t\t.onShow(function () {\n\t\t\t\t// alert(this.$refs.dialog.offsetHeight);\n\t\t\t});\n\t\t},\n\t\tdemo18 () {\n\t\t\tlet dialog = this.$dialog({\n\t\t\t\tcontent: {\n\t\t\t\t\ttemplate: `<div>我是demo11<br>\n\t\t\t\t\t 自定义动画测试哦\n\t\t\t\t\t`\n\t\t\t\t},\n\t\t\t\tclass: 'm-test-dialog',\n\t\t\t\tmethod: 'prepend',\n\t\t\t\tanimate: 11,\n\t\t\t\tposition: 'b',\n\t\t\t\ttitle: 'demo18',\n\t\t\t\tbutton: ['*确定', '取消']\n\t\t\t});\n\t\t\twindow.demo18 = dialog;\n\t\t},\n\t\tdemo19 () {\n\t\t\t//  单文件.vue\n\t\t\tlet dialog = this.$dialog({\n\t\t\t\tcontent: Input,\n\t\t\t\tclass: 'm-test-dialog',\n\t\t\t\ttitle: 'input测试',\n\t\t\t\tanimate: 0,\n\t\t\t\t// position: function () {\n\t\t\t\t// \tlet dialog = this.$refs.dialog;\n\t\t\t\t// \tlet pos = dialog.getBoundingClientRect();\n\t\t\t\t// \treturn {\n\t\t\t\t// \t\ttop: '100%',\n\t\t\t\t// \t\tleft: 0,\n\t\t\t\t// \t\tmarginTop: '-' + pos.height + 'px'\n\t\t\t\t// \t};\n\t\t\t\t// },\n\t\t\t\tposition: 'c',\n\t\t\t\twidth: '100%',\n\t\t\t\tlockIosHeight: true,\n\t\t\t\tbutton: ['\b确定', '取消']\n\t\t\t});\n\t\t\twindow.demo19 = dialog;\n\t\t}\n\t}\n};\n</script>\n\n<style>\nbody {\n\tmargin: 0px;\n}\nbutton {\n\tdisplay: block;\n\tborder:1px solid #e5e5e5;\n\tbackground-color: #fdfdfd;\n\tpadding: 10px;\n\tmargin: 5px;\n\tcolor:#0076ff;\n}\n\t/*自定义dialog动画*/\n.m-test-dialog.es-dialog-ani-11{\n\ttransform: translate(0px, 100%);\n}\n.m-test-dialog.es-dialog.es-ani-show, .m-test-dialog.es-ani-hide{\n\ttransition: all .3s linear;\n}\n</style>\n"]}, media: undefined });

	  };
	  /* scoped */
	  var __vue_scope_id__$2 = undefined;
	  /* module identifier */
	  var __vue_module_identifier__$2 = undefined;
	  /* functional template */
	  var __vue_is_functional_template__$2 = false;
	  /* style inject SSR */
	  

	  
	  var demo = normalizeComponent_1(
	    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
	    __vue_inject_styles__$2,
	    __vue_script__$2,
	    __vue_scope_id__$2,
	    __vue_is_functional_template__$2,
	    __vue_module_identifier__$2,
	    browser,
	    undefined
	  );

	var demo$1 = new Vue({
		el: '#app',
		render: function render (h) {
			return h(demo);
		}
	});
	window.Vue = Vue;

	exports.default = demo$1;

	return exports;

}({}, Vue));
