import Vue from 'vue';
import demo from './demo.vue';
export default new Vue({
	el: '#app',
	render (h) {
		return h(demo);
	}
});
window.Vue = Vue;
