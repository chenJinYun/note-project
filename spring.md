sprig:

	反射：框架级
	
	注解
	

	
	
	
web service


web socket

递归扫描任意包的，某个项目下的所有的包


spring web mvc

javaee:是规范

mvc:
	前端控制器，

路由：

配置：xml


viewName

handlerMethod

基于注解的工作：

springmvc:


路由：具体的优于模糊的

路径路由：通配符和数组，两种形式

请求方法路由：RequertMethod.GET

请求头路由：根据头信息决定路由:headers

consumes：content-type

参数路由：params

静态资源路由：在mvc:resources设置

客户端数据的接收：
前后端参数不一致：@RequestParam(value = "bid")
put请求默认没有请求体：

获取cookie数据：

路径参数：

类型转换：

校验：

数据的传递：传递model,map modelmap


modelAttribute:默认存在request中，可以手动设置

清除session


给用户响应

POI：

重定向：redirect：

图片上传和预览：

拦截器：可以拦截是否处于登录状态

乱码问题

文件上传：

总结：


SpringFramework:轻量级应用管理框架

    对象管理框架：
	
开闭原则：不允许改原有的软件，新增加去替换原有的

向外界提供注入点：不依赖某个特定的实例化类

ioc容器:控制反转

DI：依赖注入 
		
SPRING:以DI作为手段，ioc作为目的的容器

ioc特性：
	简单数据类型使用property注入，引用类型使用bean注入
	
注解：class:@Component,
	filed,method,contructor:@Autowired,@Inject,@Resource
	
接入数据源：
	
aop:开闭原则：

代理模式：InvocationHandler
	动态代理是通用代理；
	使用接口：
		
		
回调模式，指令模式，责任链模式，命令模式

JPA: java持久化api: Hibnate是jpa的一种实现;操作数据库 ORM

api:映射策略：uuid:

一级缓存的缓存清理技术：快照，flush在进行快照比较不同，单向同步

JPA：映射技术，实体类型映射，值类型映射技术，

JQL：查询技术

JPQL:完成复杂的定制化的查询

分页查询


oracle驱动

	webservice:基于http协议的服务，非耦合性的系统调用
	
	websocket:
	
异常处理：在表现层处理：

出错信息：模板定义**********

@JsonBackReference，@JsonManagedReference:解决两个pojo之间的调用，导致栈溢出

spring和jms的整合


校验：

请求路径问题：

jpa：


登录、注册页面和js全部共用；
