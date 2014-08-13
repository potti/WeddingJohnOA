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
		loadjscssfile('<c:url value="/css/app.css"/>', "css");
		loadjscssfile('<c:url value="/js/dojo-1.9.3/dijit/themes/dijit.css"/>', "css");
		loadjscssfile('<c:url value="/js/dojo-1.9.3/dijit/themes/nihilo/nihilo.css"/>', "css");
	</script>
	<script type="text/javascript" src='<c:url value="/js/dojo-1.9.3/dojo/dojo.js.uncompressed.js"/>' 
		data-dojo-config="parseOnLoad:false,mblAlwaysHideAddressBar:true,async:true,debug:'true'"></script> 
		
	<style>
	html, body{
		height: 100%;
		overflow: hidden;
	}
	
	</style>
    <body>  
        <div id="splitter" dojoType="dojox.mobile.FixedSplitter" orientation="H">
			<div id="leftPane" dojoType="dojox.mobile.Container">
				<h1 id="leftHeader" dojoType="dojox.mobile.Heading" fixed="top">
					<div style="height:42px;float: left;margin-left:6px"></div>
					<span id="leftHeaderLabel">功能菜单</span>
				</h1>
				<div id="navigation" dojoType="dojox.mobile.ScrollableView"></div>
			</div>
	
			<div dojoType="dojox.mobile.Container">
				<h1 id="header" dojoType="dojox.mobile.Heading" fixed="top">
					<button id="navButton" dojoType="dojox.mobile.ToolBarButton" 
							data-dojo-props="arrow:'left'">Back</button>
					<span id="headerLabel" style="float:center;"></span>
					<button id="logoutButton" dojoType="dojox.mobile.ToolBarButton" 
							toggle="false" style="float:right;">登出</button>
				</h1>
				<div id="rightPane" dojoType="dojox.mobile.View" selected="true" style="overflow:hidden;">
					<div id="welcome" dojoType="dojox.mobile.ScrollableView">
						<h1 dojoType="dojox.mobile.RoundRectCategory" 
							style="text-align:center;vertical-align:middle;margin-left:0px;padding-left:0px">
							<img src='<c:url value="/images/welcomeLogo.png"/>'/>
						</h1>
					</div>
					<div id="source" dojoType="dojox.mobile.View">
						<ul id="srcTabBar" dojoType="dojox.mobile.TabBar" barType="segmentedControl">
							<li id="htmlSrcTab" dojoType="dojox.mobile.TabBarButton" 
								moveTo="htmlSrcView" selected="true">HTML</li>
							<li id="jsSrcTab" dojoType="dojox.mobile.TabBarButton" moveTo="jsSrcView">JavaScript</li>
						</ul>
						<div>
							<div id="htmlSrcView" dojoType="dojox.mobile.ScrollableView" scrollDir="hv">
								<pre id="htmlContent"></pre>
							</div>
							<div id="jsSrcView" dojoType="dojox.mobile.ScrollableView" scrollDir="hv">
								<pre id="jsContent"></pre>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<div id="loadDiv" style="position:absolute;left:0px;top:0px;width:100%;height:100%;z-index:999;">
			<span>Loading...</span></div>
		<script type="text/javascript">
			require(["dojox/mobile", "dojox/mobile/parser", "dojo/ready", "app/app","dojo/request",
		        "dojox/mobile/compat", "dojox/mobile/Button",
				"dojox/mobile/ToolBarButton", "dojox/mobile/FixedSplitter", "dojox/mobile/Container",
				"dojox/mobile/ScrollableView", "dojox/mobile/SwapView", "dojox/mobile/TabBar","dijit/CalendarLite",
				"dojo/domReady!"], function(mobile, parser, ready, app, request){
					request.get("isLogin", {
		                headers: {
		                    "Content-Type": "application/json"
		                },
						handleAs : "json"
		            }).then(function(response){
		                if(response.length == 0){
		                	window.location = window.location.href + "/../login";
		                }else{
		                	app.init(response);
		                }
		            });
				});
		</script>
    </body>  
</html>  