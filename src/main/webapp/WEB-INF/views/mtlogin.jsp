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
		loadjscssfile('<c:url value="/js/bootstrap-3.3.0/css/sb-admin-2.css"/>', "css");
		loadjscssfile('<c:url value="/js/bootstrap-3.3.0/font-awesome-4.1.0/css/font-awesome.min.css"/>', "css");
	</script>
	<script src='<c:url value="/js/bootstrap-3.3.0/js/jquery-1.11.1.js"/>'></script>
	<script src='<c:url value="/js/bootstrap-3.3.0/js/bootstrap.js"/>'></script>
	<script src='<c:url value="/js/bootstrap-3.3.0/js/plugins/metisMenu/metisMenu.min.js"/>'></script>
	<script src='<c:url value="/js/bootstrap-3.3.0/js/sb-admin-2.js"/>'></script>
		
    <body>  
	    <div class="container">
		    <div class="row">
		        <div class="col-md-4 col-md-offset-4">
		            <div class="login-panel panel panel-default">
		                <div class="panel-heading">
		                    <h3 class="panel-title">请登陆</h3>
		                </div>
		                <div class="panel-body">
		                    <form role="form" id="loginform">
		                        <fieldset>
		                            <div class="form-group">
		                                <input class="form-control" placeholder="用户名" name="account" autofocus value="admin">
		                            </div>
		                            <div class="form-group">
		                                <input class="form-control" placeholder="密码" name="pwd" type="password" value="admin">
		                            </div>
		                            <div class="checkbox">
		                                <label>
		                                    <input name="remember" type="checkbox" value="记住">记住用户名
		                                </label>
		                            </div>
		                            <a id="loginbtn" class="btn btn-lg btn-success btn-block">登陆</a>
		                        </fieldset>
		                    </form>
		                </div>
		            </div>
		        </div>
		    </div>
	
		    <hr>
	
		    <footer>
		      <p>&copy; Company 2014</p>
		    </footer>
	  </div> <!-- /container -->
    </body>  
	<script type="text/javascript">
		$.fn.serializeObject = function()
		{
		    var o = {};
		    var a = this.serializeArray();
		    $.each(a, function() {
		        if (o[this.name] !== undefined) {
		            if (!o[this.name].push) {
		                o[this.name] = [o[this.name]];
		            }
		            o[this.name].push(this.value || '');
		        } else {
		            o[this.name] = this.value || '';
		        }
		    });
		    return o;
		};
		
    	$(document).ready(function(){
    		$("#loginform").on("submit",function(e) {
    			e.preventDefault();
		  		$.ajax({
	                type : 'POST',  
	                contentType : 'application/json',  
	                url : 'login',  
	                data: JSON.stringify($('#loginform').serializeObject()),  
	                dataType : 'json',
	                success : function(date){
	                	if(date == 1){
	                		window.location = window.location.href + "/../index";
	                	}else{
	                		alert('输入的用户名或密码错误');
	                	}
	                }
		  		});
	   		});
			$("#loginbtn").click(function(){
				$("#loginform").submit();
			});
    	});
	</script>
</html>  