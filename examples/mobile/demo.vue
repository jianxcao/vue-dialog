<template>
	<div>
		dialog demo <br>
		<button type="button" @click="demo1">打开一个普通弹窗</button>
		<button type="button" @click="demo2">弹窗内容是 .Vue单文件</button>
		<button type="button" @click="demo3">弹窗内容是 {template: "..."}</button>
		<button type="button" @click="demo4">弹窗内容是 {render: () => {}}</button>
		<button type="button" @click="demo4_1">弹窗内容是 Vnode</button>
		<button type="button" @click="demo5">弹窗值传递</button>
		<button type="button" @click="demo6">修改弹窗内容</button>
		<button type="button" @click="demo7">修改弹窗title</button>
		<button type="button" @click="demo8">修改dialog高度，宽度，位置</button>
		<button type="button" @click="demo9">打开多个非模态窗口</button>
		<button type="button" @click="demo10">打开多个模态窗口</button>
		<button type="button" @click="demo11">动画设置</button>
		<button type="button" @click="demo12">dialog事件演示</button>
		<button type="button" @click="demo13">dialog全局设置</button>
		<button type="button" @click="demo14">dialog自动关闭</button>
		<button type="button" @click="demo15">dialog alert接口</button>
		<button type="button" @click="demo16">dialog confirm接口</button>
		<button type="button" @click="demo17">dialog toast接口</button>
		<button type="button" @click="demo18">自定义动画</button>
		<button type="button" @click="demo19">input框测试</button>
		<div id="console">
		</div>
		<ul>
			<li v-for="n in 50">列表测试{{n}}-{{Math.random()}}</li>
		</ul>
	</div>
</template>
<script>
import Content from './content.vue';
import Input from './input.vue';
export default {
	data () {
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
		demo1 () {
			let dialog = this.$dialog('我是demo1');
			window.demo1 = dialog;
			// let vm = this;
			window.setTimeout(function () {
				// dialog.close();
			}, 3);
		},
		demo2 () {
			// let c = Content._Ctor[0];
			//  单文件.vue
			let dialog = this.$dialog({
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
		demo3 () {
			let dialog = this.$dialog({
				content: {
					template: '<div>我是demo3，我的content是一个对象，必须有template属性或者render函数，通vue初始化,template必须有根元素</div>'
				},
				method: 'prepend',
				title: 'demo3',
				button: ['*确定', '取消']
			});
			window.demo3 = dialog;
		},
		demo4 () {
			//  单文件.vue
			let dialog = this.$dialog({
				content: {
					render (createElement) {
						return createElement('div', {}, '我是demo4，我的content是一个对象，必须有template属性或者render函数，通vue初始化,template必须有根元素');
					}
				},
				title: 'demo4',
				button: ['*确定', '取消']
			});
			window.demo4 = dialog;
		},
		demo4_1 () {
			let createElement = this.$createElement;
			let vnode = createElement('div', {}, ['我是demo4_1我的内容是一个传递进来的vnode']);
			//  单文件.vue
			let dialog = this.$dialog({
				content: vnode,
				method: 'prepend',
				title: 'demo4_1',
				button: ['*确定', '取消']
			});
			window.demo6 = dialog;
		},
		demo5 () {
			//  单文件.vue
			let dialog = this.$dialog({
				content: '我是demo5，dialog的title和content的值可以通titleData和contentData传递<br>我是传递过来得值{{dialogData.cjx}}',
				method: 'prepend',
				contentData: this.dialogData,
				titleData: this.dialogData,
				title: '<span>{{dialogData.cjx.cjx[0]}}</span>',
				button: ['*确定', '取消']
			});
			window.demo5 = dialog;
		},
		demo6 () {
			//  单文件.vue
			let dialog = this.$dialog({
				content: `
					我是demote6，通过 content()方法可以修改弹窗的内容哦
					<button data-action="btn" data-ret="changeContent">点击我可以修改弹窗的内容</button>
				`,
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
		demo7 () {
				//  单文件.vue
			let dialog = this.$dialog({
				content: `
					我是demote7，通过 title()方法可以修改弹窗的title哦
					<button data-action="btn" data-ret="changeContent">点击我可以修改弹窗的title</button>
				`,
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
		demo8 () {
			//  单文件.vue
			let dialog = this.$dialog({
				content: `
					我是demote8
					通过 position属性修改弹窗的位置哦<button data-action="btn" data-ret="p">点击我可以修改弹窗的位置</button><br>
					通过 width属性修改弹窗的宽度哦<button data-action="btn" data-ret="w">点击我可以修改弹窗的宽度</button><br>
					通过 height属性修改弹窗的高度哦<button data-action="btn" data-ret="h">点击我可以修改弹窗的高度</button><br>
				`,
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
		demo9 () {
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
		demo10 () {
			this.demo2();
			this.demo1();
			this.demo3();
			this.demo2();
		},
		demo11 () {
			let dialog = this.$dialog({
				content: {
					template: `<div>我是demo11<br>
					 通过animate属性可以修改dialog的动画效果目前有1-7，可以写1-7的任意整数数字开启动画，0表示没有动画</div>
					`
				},
				method: 'prepend',
				animate: 1,
				title: 'demo11',
				button: ['*确定', '取消']
			});
			window.demo11 = dialog;
		},
		demo12 () {
			let dialog = this.$dialog({
				height: '30rem',
				content:
				`<div class="demo12">我是demo12
				 <br>主要是演示事件
				 <br>事件有
					<br>beforeMount dialog 挂载前，同vue的beforeMount
					<br>mounted dialog 挂载后，通vue得mounted
					<br>show dialog显示时候调用，每次显示都会调用
					<br>hide hide dialog隐藏时候调用
					<br>btnClick [ret] dialog上的按钮点击的时候调用，返回参数有 ret标记，表明每个按钮点击时候调用的标记,
					<br>					ret 可以通过全局配置修改，自定义按钮携带 data-action='btn'的将会触发该事件data-ret可以自定义返回标志
					<br>beforeClose dialog关闭前调用，任意一个返回false则会终止dialog关闭
					<br>close dialog关闭前调用，这个时候dom还存在，但是关闭已经触发，无法返回了
					<br>closed dialog 已经关闭啥都没有了，dom已经删除
					<br>事件调用有2种方法，一种通过 vm.$on实现，另一种通过暴露的method实现
					<br>请看 console控制台输出</div>
				`,
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
		demo13 () {
			let dialog = this.$dialog({
				content: `
					我是demote13，通过 dialog.conf可以修改dialog的一些全局配置<br>
					// 单字符样式映射<br>
					btnCssMap: {<br>
						def: 'es-dialog-btn',<br>
						'*': 'es-dialog-focus-btn'<br>
					},<br>
					// 按钮retId编码方法<br>
					getBtnRetId: function (i, n) {<br>
						return n > 1 ? n - i - 1 : 1;<br>
					}<br>
				`,
				method: 'prepend',
				title: 'demo13',
				button: ['*确定', '取消']
			});
			window.demo13 = dialog;
		},
		demo14 () {
			this.$dialog({
				content: '我可以自动关闭',
				title: '',
				animate: 3,
				timeout: 3000
			});
		},
		demo15 () {
			this.$dialog.alert('我是alert', function (ret) {
				console.log('按钮被点击了。。。。。。', ret);
			});
		},
		demo16 () {
			this.$dialog.confirm('我是confirm', function (ret) {
				console.log('按钮被点击了。。。。。。', ret);
			});
		},
		demo17 () {
			this.$dialog.toast('我是toast', 30000, function (ret) {
				console.log('toast关闭', ret);
			})
			.onShow(function () {
				// alert(this.$refs.dialog.offsetHeight);
			});
		},
		demo18 () {
			let dialog = this.$dialog({
				content: {
					template: `<div>我是demo11<br>
					 自定义动画测试哦
					`
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
		demo19 () {
			//  单文件.vue
			let dialog = this.$dialog({
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
</script>

<style>
body {
	margin: 0px;
}
button {
	display: block;
	border:1px solid #e5e5e5;
	background-color: #fdfdfd;
	padding: 10px;
	margin: 5px;
	color:#0076ff;
}
	/*自定义dialog动画*/
.m-test-dialog.es-dialog-ani-11{
	transform: translate(0px, 100%);
}
.m-test-dialog.es-dialog.es-ani-show, .m-test-dialog.es-ani-hide{
	transition: all .3s linear;
}
</style>
