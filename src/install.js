/**
 * vue dialog插件的安装
 */
export let _Vue;

let installed = false;
/**
 * 传入dialog
 * 传入 dialogComponent取创建 es-dialog标签
 */
export default (dialog, dialogComponent) => function install (Vue) {
	if (installed) {
		return;
	}
	installed = true;

	_Vue = Vue;
	// 定义vue实例的 dialog方法，在实例中可以直接使用 $dialog
	Object.defineProperties(Vue.prototype, {
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
			value: function (...arg) {
				return dialog.toast(...arg);
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
};
