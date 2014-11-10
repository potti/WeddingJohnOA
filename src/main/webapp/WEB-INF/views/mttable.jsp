<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>  
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page isELIgnored="false" %>

<div id="page-wrapper">
    <div class="row">
        <div class="col-lg-12">
            <h1 class="page-header">Tables</h1>
        </div>
        <!-- /.col-lg-12 -->
    </div>
    <!-- /.row -->
    <div class="row">
        <div class="col-lg-12">
            <div class="panel panel-default">
                <div class="panel-heading">
                    DataTables Advanced Tables
                </div>
                <!-- /.panel-heading -->
                <div class="panel-body">
                    <div class="table-responsive">
                        <table class="table table-striped table-bordered table-hover" id="dataTables-example">
                            <thead>
                                <tr>
                                    <th>Order NO.</th>
                                    <th>Date</th>
                                    <th>Company</th>
                                    <th>Need Man</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>
                <!-- /.panel-body -->
            </div>
            <!-- /.panel -->
        </div>
        <!-- /.col-lg-12 -->
    </div>
</div>
<!-- /#page-wrapper -->


<!-- DataTables JavaScript -->
<script src='<c:url value="/js/bootstrap-3.3.0/js/plugins/dataTables/jquery.dataTables.js"/>'></script>
<script src='<c:url value="/js/bootstrap-3.3.0/js/plugins/dataTables/dataTables.bootstrap.js"/>'></script>

<script>
$(document).ready(function() {
    $('#dataTables-example').dataTable({
    	"processing": true,
    	"ajax": {
		    "url": "../mt/orders",
		    "type": "POST",
		    "contentType" : "application/json"
    	},
    	"columns": [
            { "data": "orderNo" },
            { "data": "startDate" },
            { "data": "companyId" },
            { "data": "needman" },
            { "data": "status" }
        ]
	});
});
</script>