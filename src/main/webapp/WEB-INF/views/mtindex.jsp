<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>  
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page isELIgnored="false" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">  
<html lang="zh-cn">  
   <head>
	   <meta charset="utf-8">
	   <meta http-equiv="X-UA-Compatible" content="IE=edge">
	   <meta name="viewport" content="width=device-width, initial-scale=1, maximum-sacle=1, user-scalable=no">
       <title>Wedding John OA 后台管理系统</title>
       
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
		loadjscssfile('<c:url value="/js/bootstrap-3.3.0/css/plugins/metisMenu/metisMenu.min.css"/>', "css");
		loadjscssfile('<c:url value="/js/bootstrap-3.3.0/css/plugins/timeline.css"/>', "css");
		loadjscssfile('<c:url value="/js/bootstrap-3.3.0/css/sb-admin-2.css"/>', "css");
		loadjscssfile('<c:url value="/js/bootstrap-3.3.0/css/plugins/morris.css"/>', "css");
		loadjscssfile('<c:url value="/js/bootstrap-3.3.0/font-awesome-4.1.0/css/font-awesome.min.css"/>', "css");
	</script>
	
	<!-- jQuery -->
	<script src='<c:url value="/js/bootstrap-3.3.0/js/jquery-1.11.1.js"/>'></script>
	<!-- Bootstrap Core JavaScript -->
	<script src='<c:url value="/js/bootstrap-3.3.0/js/bootstrap.js"/>'></script>
	<!-- Metis Menu Plugin JavaScript -->
	<script src='<c:url value="/js/bootstrap-3.3.0/js/plugins/metisMenu/metisMenu.min.js"/>'></script>
	<!-- Custom Theme JavaScript -->
	<script src='<c:url value="/js/bootstrap-3.3.0/js/sb-admin-2.js"/>'></script>
	
    <body>  
	    <div id="wrapper">
	    
		    <jsp:include page="mthead.jsp" flush="true" />
		    
		    <jsp:include page="${modelName}.jsp" flush="true" />
	
		</div>
		<!-- /#wrapper -->
	
		<hr>
		<footer>
		  <p>&copy; Company 2014</p>
		</footer>
    </body>  
</html>  