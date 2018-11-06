# 项目技术架构：
    1、node.js环境
    2、npm 管理包
    3、git 版本控制管理
    4、fiddler 捉包工具

### fiddler 捉包工具的使用：
    1、如果chrome的代理不是默认的需要设置为端口8888，因为fiddler的默认设置端口号是8888,当然也可以自定义
    2、一些大网站不允许劫持，比如说baidu.com这些
   ### 代理的原理
    request-->fiddler--->设置好的网址内容或者是正常的网址内容，也就是劫持了请求的网址并且返回自定义设置的网址内容

### 项目搭建：
    1、初始化项目：src--源代码目录
    2、npm 配置成cnpm
    3、webpack的使用

### Webpack
    1、 全局安装，版本为1.，不用2.的原因是ie8不支持webpack打包后的一个Object.default的属性
    2、 