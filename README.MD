# Dialog #
---
电商基础vue Dialog组件，包含PC版本和移动版本

## 基本API

### dialog(options\_or\_content [,callback])
按照配置打开一个对话框，@return  [dialog控制对象-vue的一个实例对象](#dialog实例对象)。

#### 使用方法-直接调用全局api
``` js
    // wap版本用wap/dialog
	import dialog from 'dialog/pc/dilaog';
	var d = dialog({
		title: "hi",
		contentData: {
			test: 1111
		},
       content: {
       	template: "<div>hello 程序猿~, {{test}}</div>"
       },
       button: ["*hello", "bye"]
	});
	hi.content("你好程序猿~");
	hi.onClosed(function(ret){
	    alert("dialog destoried!");
	});
	hi.$on('close', function(ret) {
		alert('dialog close');
	});
	window.setTimeout(function(){
	    d.close();
	}, 3000);
```
#### 使用方法- 通过vue实例调用$dialog-$alert-$toast-$confirm
``` js
	import dialog from 'dialog/pc/dilaog';
	new Vue({
		template: '',
		methods () {
			openDialog: function () {
				this.$dialog({
					title: "我是dialog"
					content: "我是content"
				});
			}
		}
	});
```

### $.dialog([dialogID\_or\_dialogInstance [,returnValue]])
关闭指定的对话框，并设定指定的 returnValue，默认 undefined。
 - 如果不提供参数，则关闭所有的对话框
 - dialogID: 关闭指定id的对话框
 - dialog实例: 关闭当前对话框

```js
//关闭上面demo中的hi对话框，等同 hi.close("test");
$.dialog(hi, "test");
```

### options说明
- **title** : `null`,	可选，`string`、 `null`、 `vue 组件` 、 `vue vnode`、`vue 组件配置对象`<br>
	对话框标题，若标题为空字符，则不显示标题栏（仍显示关闭按钮）；如果为null，则不显示标题栏也不显示关闭按钮；

- **titleData** : `Object` title上如果是个vue组件，vue组件需要的数据

- **content** : `""`,	必选，`string`、 `null`、 `vue 组件` 、 `vue vnode`、`vue 组件配置对象`	对话框内容，如果 type 是 insert/agent 时必须是一个 selector或dom

- **contentData** : `Object` content上如果是个vue组件，vue组件需要的数据

- **width** : `0`,	可选，`number、string`<br>
	对话框宽度，若为0，则跟随内容宽度自适应，无最小宽度限制。

- **height** : `0`,	可选，`number、string` <br>
	对话框高度，若为0，则跟随内容高度自适应，无最小高度限制，否则主体部分保持最小高度(wap最小2.92rem, pc最小50px)

- **button** : `["确定"]`,	可选，`<string>array`<br>
	对话框按钮，若为空数组，则不显示按钮栏；如果按钮字符以 \*开头，则表示是默认按钮(追加 focusBtn 样式)，但 \* 不显示，默认按钮在打开时会被聚焦选中。更多单字符按钮样式，参考高级API设置。

- **method** : `"prepend"`,	可选，`"append"`、`"prepend"`<br>
	对话框dom元素的插入方法，append方法会导致在某些长页面中，对话框中的输入元素响应过慢。默认 prepend 无需修改。

- **css** : `""`,	可选，`string` 或 内置的样式(`"iDialogError"`、`"iDialogAlert"`、`"iDialogConfirm"`、`"iDialogInfo"`)<br>
	对话框附加样式，该样式被添加到对框框最外层元素上。

- **position** : `"c"`,	可选，`数字0~8`、`整数数组`、`坐标对象`、`字符示位`、`自定义方法`<br>
	定位对话框的位置，默认居中
	- 0 可用屏幕中央 1-8分别从屏幕左上角顺时针对应八个位置
	- 若为数组，则以该数组给定的xy坐标显示
	- 若为对象则当作定位样式处理，支持left、right、top、bottom属性，如果值是 auto/c/center 则居中显示，比如 left:"auto" 则左右居中
	- 若为字符，则可以处理 t l r b c 字符的任何合理组合
	- 若是自定义方法，则必须返回 `object`， `oject`必须有 `left，top， bottom，right`的属性

- **dragable** : `1`,	可选,`boolean`、`1`、`2`、`0`<br>
    拖动暂未实现-wap版本不支持，pc后续实现<br>
	是否允许对话框可拖动
	- false 或 0：不可以拖动
	- true 或 1：启动标题拖动，但如果 title为空字符串或者null，则不能拖动（因为缺少拖动响应区域）
	- 2：面板拖动，可编辑元素除外

- **animate** : `15`,	可选，`number`<br>
	0-7之间的数字动画，也可以自定义动画

- **layout** : `true`,	可选，`boolean`、`1`、`2`、`0`<br>
	是否显示蒙层，即打开模拟的模态窗口（添加全屏蒙层）
	- false 或 0：不创建蒙层
	- true 或 1：创建自动算法的蒙层（第一个灰色半透，后续全透明）
	- 2：强制创建半透蒙层，仅仅适用一些边界不清楚，同时又窗上弹窗的场景

- **timeout** : `0`,	可选, `number`<br>
	是否自动关闭对话框，为0则不自动关闭，单位ms


### dialog实例对象
#### 实例对象属性
- id: string 只读属性，获取dialog的id
- width string, number 控制宽度
- height: string, number 控制高度
- hidden: boolean 控制显示隐藏
- button: array 控制按钮
- titleData: Object title的数据(在title组件中有数据 dialogData, titleData)
- contentData Object  content的数据(在content组件中有数据 dialogData, contentData)
- position string, object, array 控制位置
- dragable boolean 控制拖动 - 拖动暂时未实现
- layout number, boolean控制蒙层
- animate number 控制动画
- timeout nummber 控制超时

> 以上属性为 实例属性，属性改变即时生效

#### 实例$refs属性
- dialog 整个dialog对象的dom
- footer 整个footer的dom
- main 整个dialog main的dom
- title 整个dialog的title dom
- $content content的vue组件实例，可以从该组件上获取数据
- $mask 蒙层的vue组件实例
- $title title的vue组件实例

#### 实例对象方法
- show 显示方法，显示dialog
- hide 隐藏方法，隐藏dialog
- setTop 设置当前dialog在最顶层(如果页面正在有dialog挂在中，调用该方法无效)
- setPosition 在postion属性没有变的情况下强制设置位置
	* 参数为true强制重新调用设置位置方法，位置和原来相同
	* 参数 为string,number,Object规则通属性position
	* 参数为fun，需返回位置信息，同 position
- close(ret) 关闭当前dialog,可以带自定义的关闭事件返回值
- destroy 同close
- toString 返回id


#### 实例对象事件名称
- beforeMounted 挂载前事件，同vue的beforeMounted方法
- mounted 挂载事件，通vue得mounted事件
- show 显示dialog，动画完成后显示后调用
- hide 隐藏dialog，动画完成后隐藏调用
- btnClick 带有`data-action="btn"`的按钮被点击时候的触发，会返回传入的returnValue或者，按钮上的 `data-ret` 属性的值
- beforeClose 弹窗关闭前,返回false则取消关闭，方法参数是returnValue
- close 关闭弹窗，dom未删除，方法参数是 returnValue
- closed 弹窗关闭后，这个时候dom已经删除了

#### 实例对象事件绑定方法


- onBeforeMounted(fun)  挂载前事件，同vue的beforeMounted方法
- onMounted(fun) 组件挂载事件，首次插入dom时候调用
- onShow(fun) dialog显示方法
- onHide(fun) dialog隐藏方法
- onBtnClick(fun) 点击按钮
- onBeforeClose(fun) dialog关闭前事件， 返回false阻止关闭
- onClose(fun) 关闭事件，dom还在
- onClosed(fun) 关闭事件dom不再了
> 通过以下method绑定

``` js
	var d = dialog({
		title: "hi",
       content: "hello 程序猿~",
       button: ["*hello", "bye"]
	});
	d.onClose(function () {
		console.log('close');
	});

```

> 通过 instance.$on, $once 绑定

``` js
	var d = dialog({
		title: "hi",
       content: "hello 程序猿~",
       button: ["*hello", "bye"]
	});
	d.$on('close', function () {
		console.log('close');
	});
	d.$once('beforeMounted', function () {
		console.log('close');
	});

```


## 快捷API
dialog组件提供了一些包装接口，用于快速创建一定格式的对话框。

 - **dialog.confirm(content [,btn] [,callback])**
 - **dialog.alert(content [,btn] [,callback])**
 - **dialog.error(content [,btn] [,callback])**
 - **dialog.info(content [,btn] [,callback])**
 - **dialog.toast(content [,timeout] [,callback])**

## 高级API

```js
//修改dialog全局配置
dialog.conf({
	btnCssMap: {
		//默认dialog按钮的样式
		def: "iDialogBtn",
		//默认的单字符映射，仅仅 *
		"*": "focusBtn"
	},
	//按钮retId编码方法
	getBtnRetId: function(i, n) {
		return n > 1 ? n - i - 1 : 1;
	},
	//是否使用table模拟的边框
	useTableBorder: true
});
```
## 构建功能

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# run unit tests
npm run unit

# run all tests
npm test
```


## 存在问题
1. 暂时不支持dragable参数
2. 自动关闭，或者调用close必须是在 show之后，否则无效
3. dialog的层级是统一管理的包括 模态弹窗和非模态弹窗
4. dialog 动画animate总共是1-7种，如果给错，会导致动画出现问题
