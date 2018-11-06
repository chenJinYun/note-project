# SpringMVC #
 	springmvc是spring框架的一部分，是基于mvc的表现层框架，用于web项目的开发。

#1.前端控制器的配置
  
    只有一个servlet 为 dispatcher，称为前端控制器，在web.xml中进行配置。

   1.1 url-parttern

			1. “/*”:表示“全部匹配”。
			
			2. “/”:表示“除具体匹配外”的所有匹配。
			
			3. tomcat(conf/web.xml)url-parttern:/、*.jsp,*.jspx
			
			4. 如果spring配置“/”,将覆盖所有除jsp和jspx外的所有路径
			
			5. 这将导致html,css,js等静态资源无法访问


   1.2配置文件可以配置的选项有：



#2.后端控制器：

	在dispatcher.xml中配置：指定对应的包下面的全部controller
		<mvc:annotation-driven conversion-service="conversionService"/>
		<context:component-scan base-package="urlDemo"/>

	2.1@Controller:表明该类是一个后端控制器

	2.2@RequestMapping
 				
			1. 在类头上定义，表示该类下的全部控制器的请求地址都以配置的value开头
			
				eg：@RequestMapping(value = "customers") 都以customers开头

			2.  在方法头定义，表示该控制器的方法结尾：
			
				eg:@RequestMapping("work7") 对应的路径为类头配置的value/work7

#3.ViewReslover

		 - 这是用来解析“逻辑视图”，将委托给“物理视图”的解析器，以下是它们的实现类：
				InternalResourceViewResolver.class
				ResourceBundleViewResolver.class
				XmlViewResolver.class
				BeanNameViewResolver.class

	3.1具体配置为：
		<bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        	<property name="order" value="1"/>
        	<property name="viewClass" value="org.springframework.web.servlet.view.JstlView"/>
        	<property name="prefix" value="/"></property>
        	<property name="suffix" value=".jsp"></property>
    	</bean>

#4.路由的几种设置方式：具体的优于模糊的

 	4.1请求路径设置：通配符和数组的形式：
		
		eg:@RequestMapping(value={"work1,work11"}),
		  @RequestMapping(value="/path/*.a")

   		4.1.1通配符说明：？ 匹配任何单字符、 *匹配0或者任意数量的字符、 **匹配0或者更多的目录

  	4.2请求方法路由：根据请求方法匹配
		
		语法：
		@RequestMapping(method=RequestMethod.POST);

		@Get/Post/Delete/Put Mapping();

		eg：@RequestMapping(method = {RequestMethod.POST,RequestMethod.PUT})

		4.2.1关于解决put请求请求体的解决方法：增加过滤器HiddenHttpMethodFilter

			具体配置如下：
				 <filter>
				    <filter-name>putForm</filter-name>
				    <filter-class>org.springframework.web.filter.HttpPutFormContentFilter</filter-class>
				  </filter>
				
				  <filter-mapping>
				    <filter-name>putForm</filter-name>
				    <url-pattern>/*</url-pattern>
				  </filter-mapping>

	4.3请求头路由：根据请求头匹配
		
		eg:@GetMapping(value = "ab",headers = {"action=kim"})匹配请求头有action字段的请求

		注意点：

		1、可以使用consumes={“”}相当于headers=“Content-Type=”
		2、可以使用produces={“”}相当于headers=“Accept=”

		eg:@GetMapping(value = "ab",consumes ={"application/xml"})

	4.4请求参数的路由:根据是否有某个或者某些参数匹配

		eg：@GetMapping(value = "ac",params = {"id=1"}) 匹配有参数id的请求
	
	4.5静态资源路由：可以解决静态资源被拦截的问题
		
		在dispatcher.xml中配置：
			<!-- 对静态资源的访问 -->
			<mvc:resources mapping="/css/**" location="/css/" />
			<mvc:resources mapping="/image/**" location="/image/" />
			<mvc:resources mapping="/js/**" location="/js/" />
			<mvc:resources mapping="/fonts/**" location="/fonts/" />

#5.客户端数据接收
	
   	 1、控制器方法里面的形参都是作为接收参数的，
 
   	 2、匹配规则的字段名一致则匹配

	 3、前后端字段不一致，@RequestParam(value = "bid") 来匹配
	 
	 4、获取cookie的值：@CookieValue(value="字段名")
	
	 5、获取路径中的参数：
		eg：
		  @GetMapping("{bid}/author/{aid}")
		    public String work3(@PathVariable("bid") int bookid,@PathVariable("aid") int authorid){
		        return bookid+"..."+authorid;
		    }

	6、json形式的请求体接收

		注意点：
			1.请求头中必须加入Content-Type:application/json
			2.json的形式必须使用“双引号”
			3.<mvc>标签必须使用
			4.引入jackson包

		获取json格式的参数使用：@RequestBody

	7、获取date格式的数据：
		
		使用@DateTimeFormat

#6.数据的传递：

		请求处理方法的形参可以是：request,response,session,inputStream,outStream,Writer,Reader，

		框架会自动识别，并将传入实参，但“侵入度过高”

		当形参类型是Map,Model,ModelMap时，框架会将其实参置入request。

		也可以利用@ModelAttributer进行指定

		eg:
		    @GetMapping("work2")
		    public String work2(@ModelAttribute(value = "bk") BookPojo book, SessionStatus status) {
		        //        model.addAttribute("cname","kim");
		        book.setId(123);
		        //清除session
		        status.setComplete();
		        return "suc";
		    }

		6.1保存数据在session中：
			
			使用：@SessionAttributes(value = {"bk"})
			设置值：在控制器中使用model.addAttributeName("bk",value)

			清除session的值：SessionStatus status --> status.setComplete();

#7.对客户端的响应：
		
		转发链和重定向：

			语法：	forward: /xxx     :表示将转发到下一个/xxx上
					redriect: /xxx    :表示重定向到下一个/xxx上

			eg:  return "redirect:work4";
       			 return "forward:work4";

	7.1文件预览和文件下载：

		文件预览具体实例如下：
			    @GetMapping("work5")
			    public void work5(OutputStream out, HttpSession sen, HttpServletResponse resp) throws Exception {
			        resp.addHeader("Content-Type", "image/jpg");
			        String path = sen.getServletContext().getRealPath("/upload/a.jpg");
			        InputStream in = new FileInputStream(path);
			        byte[] buf = new byte[1024];
			        int len = 0;
			        while ((len = in.read(buf)) != -1) {
			            out.write(buf, 0, len);
			        }
			        in.close();
			        out.close();
			    }

		文件下载：只需要把响应头修改成：resp.addHeader("Content-Disposition", "attachment;filename=a.jpg");

#8.拦截器：可以用于有前提条件的控制器，进行拦截，，HandlerInterceptor

		设置方式：在dispatcher.xml
			    <!--拦截器-->
				    <mvc:interceptors>
				        <mvc:interceptor>
				            <mvc:mapping path="/list/allList"></mvc:mapping>
				            <bean class="urlDemo.LoginInterceptor"></bean>
				        </mvc:interceptor>
				        <mvc:interceptor>
				            <mvc:mapping path="/list/deleteList"></mvc:mapping>
				            <bean class="urlDemo.LoginInterceptor"></bean>
				        </mvc:interceptor>
				        <mvc:interceptor>
				            <mvc:mapping path="/customers/*"></mvc:mapping>
				            <bean class="urlDemo.MyInterceptor"></bean>
				        </mvc:interceptor>
				    </mvc:interceptors>

		拦截器的实现：有三个方法可以重写：preHandle（请求进入的时候） postHandle（数据回显的时候） afterCompletion（完成渲染的时候）

			注意点：preHandle的返回值为false，后面的拦截器不执行，handler也不执行·

					preHandle的·返回值为true,正常运行，相当于这次请求符合要求

#9.文件上传：
	
	使用commons-fileupload插件
	
	具体用法如下：
		1、dispatcher.xml配置<bean class="org.springframework.web.multipart.commons.CommonsMultipartResolver" id="multipartResolver"></bean>
		2、可以通过一些方法获取源文件的信息，和内容

		eg:
		    @RequestMapping("work7")
		    public String work7(List<MultipartFile> heads, String uname) throws Exception {
		        for (MultipartFile file : heads) {
		            System.out.println(file.getOriginalFilename());
		            System.out.println(file.getName());
		            System.out.println(file.getBytes().length);
		        }
		        return "suc";
		    }
			


#10中文乱码问题：在web.xml中设置
		 <filter>
	        <filter-name>charater</filter-name>
	        <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
	        <init-param>
	            <param-name>encoding</param-name>
	            <param-value>UTF-8</param-value>
	        </init-param>
	    </filter>
	
	    <filter-mapping>
	        <filter-name>charater</filter-name>
	        <url-pattern>/*</url-pattern>
	    </filter-mapping>

	并且在idea设置:-Dfile.encoding=UTF-8
			
		




	
		
		

  
	 

   

