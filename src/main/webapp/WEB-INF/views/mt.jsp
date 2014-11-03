<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>  
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page isELIgnored="false" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">  
<html lang="zh-cn">  
   <head>
	   <meta charset="utf-8">
	   <meta http-equiv="X-UA-Compatible" content="IE=edge">
	   <meta name="viewport" content="width=device-width, initial-scale=1, maximum-sacle=1, user-scalable=no">
       <title>Wedding John OA Manager System</title>
       
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
    
		loadjscssfile('<c:url value="/js/bootstrap-3.3.0/css/bootstrap.css"/>', "css");
	</script>
	<script src='<c:url value="/js/jquery-1.11.1.js"/>'></script>
	<script src='<c:url value="/js/bootstrap-3.3.0/js/bootstrap.js"/>'></script>
		
    <body>  
	    <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
	    <div class="container">
	      <div class="navbar-header">
	        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
	          <span class="sr-only">Toggle navigation</span>
	          <span class="icon-bar"></span>
	          <span class="icon-bar"></span>
	          <span class="icon-bar"></span>
	        </button>
	        <a class="navbar-brand" href="#">后台管理系统</a>
	      </div>
	      <div id="navbar" class="navbar-collapse collapse">
	        <form class="navbar-form navbar-right" role="form">
	          <div class="form-group">
	            <input type="text" placeholder="用户名" class="form-control">
	          </div>
	          <div class="form-group">
	            <input type="password" placeholder="密码" class="form-control">
	          </div>
	          <button type="submit" class="btn btn-success">登陆</button>
	        </form>
	      </div><!--/.navbar-collapse -->
	    </div>
	  </nav>
	
	  <!-- Main jumbotron for a primary marketing message or call to action -->
	  <div class="jumbotron">
	    <div class="container">
	      <h1>Hello, world!</h1>
	      <p>This is a template for a simple marketing or informational website. It includes a large callout called a jumbotron and three supporting pieces of content. Use it as a starting point to create something more unique.</p>
	      <p><a class="btn btn-primary btn-lg" href="#" role="button">Learn more &raquo;</a></p>
	    </div>
	  </div>
	
	  <div class="container">
	    <!-- Example row of columns -->
	    <div class="row">
	      <div class="col-md-4">
	        <h2>Heading</h2>
	        <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. </p>
	        <p><a class="btn btn-default" href="#" role="button">View details &raquo;</a></p>
	      </div>
	      <div class="col-md-4">
	        <h2>Heading</h2>
	        <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. </p>
	        <p><a class="btn btn-default" href="#" role="button">View details &raquo;</a></p>
	     </div>
	      <div class="col-md-4">
	        <h2>Heading</h2>
	        <p>Donec sed odio dui. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Vestibulum id ligula porta felis euismod semper. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.</p>
	        <p><a class="btn btn-default" href="#" role="button">View details &raquo;</a></p>
	      </div>
	    </div>
	
	    <hr>
	
	    <footer>
	      <p>&copy; Company 2014</p>
	    </footer>
	  </div> <!-- /container -->
    </body>  
</html>  