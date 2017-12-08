/**
 * pc版本dialog
 */
import {base} from '../base';
import Vue from 'vue';
import main from '../main';
import './index.less';

const Dialog = Vue.extend({
	mixins: [base]
});
// 生成dialog调用方法
const dialog = main(Dialog);
// 导出dialog调用方法
export default dialog;
// 导出 alert方法
export const alert = dialog.alert;
// 导出toast方法
export const toast = dialog.toast;
// 导出 conf方法
export const confirm = dialog.confirm;
//  info方法
export const info = dialog.info;
//  error方法
export const error = dialog.error;
// 导出 dialog全局配置方法
export const conf = dialog.conf;
