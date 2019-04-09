<template>
	<div class="inner" data-test="1111">
		我是demo2，我的内容是一个单vue文件，数据是从属性 contentData属性获取<br>
		{{ccc}}{{dialogData.cjx.cjx}} {{dialogData.test}}
		<child>test</child>
		<button @click="changeT">修改test</button><br>
		<button @click="ff">修改cjx</button>
	</div>
</template>

<script>
	const child = {
		template: '<em>我是子节点</em>'
	};
	window.child = child;
	export default {
		data () {
			return {
				ccc: 'ccc'
			};
		},
		methods: {
			ff () {
				this.dialogData.cjx.cjx = 'cjx' + Math.random();
			},
			changeT () {
				this.dialogData.test = Math.random();
			}
		},
		components: {
			child
		}
	};
</script>
