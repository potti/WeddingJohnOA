<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>  
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page isELIgnored="false" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">  
<html>  
   <head>
        <meta http-equiv="Content-type" content="text/html; charset=utf-8"/>
        <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <title>Wedding John OA System</title>
       
    </head>
    <script type="text/javascript">
	    function loadjscssfile(filename, filetype){
		 if (filetype=="js"){ // if filename is a external JavaScript file
		  var fileref=document.createElement('script');
		  fileref.setAttribute("type","text/javascript");
		  fileref.setAttribute("src", filename);
		 }
		 else if (filetype=="css"){ // if filename is an external CSS file
		  var fileref=document.createElement("link");
		  fileref.setAttribute("rel", "stylesheet");
		  fileref.setAttribute("type", "text/css");
		  fileref.setAttribute("href", filename);
		 }
		 if (typeof fileref!="undefined")
		  document.getElementsByTagName("head")[0].appendChild(fileref);
		}
    
		var userAgent = navigator.userAgent;
		if (userAgent.indexOf("Android") > -1) {
			loadjscssfile('<c:url value="/js/dojo-1.9.3/dojox/mobile/themes/android/android.css"/>', "css");
			loadjscssfile('<c:url value="/css/themes/android/gallery.css"/>', "css");
		} else if (userAgent.indexOf("iPad") > -1) {
			loadjscssfile('<c:url value="/js/dojo-1.9.3/dojox/mobile/themes/iphone/iphone.css"/>', "css");
			loadjscssfile('<c:url value="/js/dojo-1.9.3/dojox/mobile/themes/iphone/ipad.css"/>', "css");
			loadjscssfile('<c:url value="/css/themes/iphone/gallery.css"/>', "css");
		} else if (userAgent.indexOf("iPhone") > -1) {
			loadjscssfile('<c:url value="/js/dojo-1.9.3/dojox/mobile/themes/iphone/iphone.css"/>', "css");
			loadjscssfile('<c:url value="/css/themes/iphone/gallery.css"/>', "css");
		} else {
			loadjscssfile('<c:url value="/js/dojo-1.9.3/dojox/mobile/themes/iphone/iphone.css"/>', "css");
			loadjscssfile('<c:url value="/css/themes/iphone/gallery.css"/>', "css");
		}
		loadjscssfile('<c:url value="/css/login.css"/>', "css");
	</script>
	<link href='<c:url value="/css/common/buttons.css"/>' type="text/css" rel="stylesheet">
	<script type="text/javascript" src='<c:url value="/js/dojo-1.9.3/dojo/dojo.js"/>' 
		data-dojo-config="parseOnLoad:false,mblAlwaysHideAddressBar:true,async:true"></script>
		
    <body background='<c:url value="/images/login/login_bg_image.jpg"/>'>  
    <div data-dojo-type="dojox.mobile.View">
	    <form name="loginFrom" id="loginFrom">
		    <div style="position:relative;width:539px;height:841px;z-index:1;left:30%;top:10%;">
		    	<img src='<c:url value="/images/login/login_box_ept_image.png"/>' width="100%" height="100%"/>
		    	<input id="account" type=text data-dojo-type="dojox.mobile.TextBox" name="account" required 
					style="width:176px;position:absolute;left:33%;top:28%;" value=""/>
				<input type=password id="pwd" name="pwd" data-dojo-type="dojox.mobile.TextBox" 
					style="width:176px;position:absolute;left:33%;top:33%;" value=""/>
				<button id="loginBtn" class="loginBtn"
					style="width:95px;height:43px;position:absolute;left:70%;top:30%;z-index:2;background-repeat:no-repeat;">
				</button>
		    </div>
	    </form>			
    </div>
				
			
	<script type="text/javascript">
		require(["dojo/dom","dojo/on","dijit/registry","dojo/request","dojo/dom-form","dojo/json","dijit/Tooltip","dojox/mobile","dojox/mobile/parser","dojo/ready", 
		    "dojox/mobile/View","dojox/mobile/Button","dojox/mobile/TextBox",
			"dojo/domReady!"], function(dom,on,registry,request,domForm,JSON,Tooltip,mobile,parser,ready){
				ready(function(){
					parser.parse();
					on(dom.byId('loginFrom'), "submit", function(evt){
			            evt.stopPropagation();
			            evt.preventDefault();
			            request.post("login", {
			                data: domForm.toJson("loginFrom"),
			                headers: {
			                    "Content-Type": "application/json"
			                }
			            }).then(function(response){
			                if(response == 1){
			                	window.location = window.location.href + "/../index";
			                }else{
			                	var password = registry.byId('pwd');
			                	password.set('value',"");
			                	alert('输入的密码错误');
			                }
			            });
					});
				});
			});
	</script>
    </body>  
</html>  