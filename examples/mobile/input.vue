<template>
	<div class="input-test">
		<input type="text" name="test">
		<textarea rows="" cols="">我是test</textarea>
	</div>
</template>
<script>
	export default {
		methods: {
			ff () {
				this.cjx.cjx = 'cjx' + Math.random();
			},
			changeT () {
				this.test = Math.random();
			}
		}
	};
</script>
<style>
.input-test {
	padding-bottom: 2px;
}
input, textarea{
	border: 1px solid #aaa;
	width: 100%;
	font-size: 1.5rem;
	-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
	outline: none;
	line-height: 1;
}
</style>
