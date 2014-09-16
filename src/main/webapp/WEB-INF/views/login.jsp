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
	</script>
	<link href='<c:url value="/css/common/buttons.css"/>' type="text/css" rel="stylesheet">
	<script type="text/javascript" src='<c:url value="/js/dojo-1.9.3/dojo/dojo.js"/>' 
		data-dojo-config="parseOnLoad:false,mblAlwaysHideAddressBar:true,async:true"></script>
    <body>  
    
    <div id="gridLayout" data-dojo-type="dojox.mobile.View">
	    <div data-dojo-type="dojox.mobile.GridLayout" data-dojo-props='cols:1' style="height:640px;">
		    <div data-dojo-type="dojox.mobile.Pane" style="width:100%;position:relative">
				<img alt="" src='<c:url value="/images/login/Mountain.jpg"/>' style="width:100%;height:100%"/>
				<form name="loginFrom" id="loginFrom" style="position:absolute;top:20%;left:4%;width:260px">
					<div data-dojo-type="dojox/mobile/RoundRect">
						<div data-dojo-type="dojox/mobile/FormLayout">
							<div>
								<label style="width:30%;position:relative">用户名</label>
								<fieldset>
									<input id="account" type=text data-dojo-type="dojox.mobile.TextBox" name="account" required 
										style="width:100%;position:relative" value=""/>
								</fieldset>
							</div>
							<div>
								<label style="width:30%;position:relative">密码</label>
								<fieldset>
									<input type=password id="pwd" name="pwd" data-dojo-type="dojox.mobile.TextBox" 
										style="width:100%;position:relative" value=""/>
								</fieldset>
							</div>
							<div>
								<label></label>
								<fieldset style="width:100%;position:relative">
									<button dojoType="dojox.mobile.Button" id="loginBtn" style="float:right" class="navyBtn">登陆</button>
								</fieldset>
							</div>
						</div>
					</div>
				 </form>
			</div>
	    </div>
    </div>
			
	<script type="text/javascript">
		require(["dojo/dom","dojo/on","dijit/registry","dojo/request","dojo/dom-form","dojo/json","dijit/Tooltip","dojox/mobile","dojox/mobile/parser","dojo/ready", 
		    "dojox/mobile/View", "dojox/mobile/GridLayout","dojox/mobile/Button",
			"dojox/mobile/Pane", "dojox/mobile/TextBox", "dojox/mobile/RoundRect", "dojox/mobile/FormLayout", 
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
			                // handleAs: "json"
			            }).then(function(response){
//			            	var obj = JSON.parse(response);
			                if(response == 1){
			                	window.location = window.location.href + "/../index";
			                }else{
			                	var password = registry.byId('pwd');
			                	password.set('value',"");
			                	alert('输入的密码错误');
//			                	Tooltip.show('输入的密码错误',password.domNode,'above'); 
			                }
			            });
					});
				});
			});
	</script>
    </body>  
</html>  