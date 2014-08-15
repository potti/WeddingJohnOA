define(["dojo/dom",
        "dojo/on",
        "dijit/registry",
        "dojo/request",
        "dojo/date/locale",
        "dojo/_base/connect",
        "app/app",
        "app/src/structure",
        "dojo/dom-form",
        "dojo/json",
		// not used in this module, but dependency of the demo template HTML
		"dojox/mobile/TextBox",
		"dojox/mobile/FormLayout"
		], function(dom,on,registry,request,locale,connect,app,structure,domForm,JSON) {
	var internalNavRecords = [];
	return {
		init: function(){
			var viewId = "changePwd";
			var self = this;
			on(registry.byId("cpResetBtn"), "click", function(){
				dom.byId("changePwdForm").reset();
			});
			
			connect.subscribe("onAfterDemoViewTransitionIn", function(id) {
				if (id == self.viewId) {
					var navRecords = structure.navRecords;
					for (var i = 0; i < internalNavRecords.length ; ++i) {
						navRecords.push(internalNavRecords[i]);
					}
					// need to restore the title of previous view in internal navigation history
					if (navRecords.length > 0) {
						dom.byId("headerLabel").innerHTML = navRecords[navRecords.length -1].toTitle;
					}
				}
			});
			
			dom.byId("changePwdForm").reset();

			on(registry.byId("cpSubmitBtn"), "click", function() {
				if(registry.byId("newPwd").get('value') != registry.byId("repeadPwd").get('value')){
					alert("两边密码不一致");
					return;
				}
				request.put("changePwd", {
					data : domForm.toJson("changePwdForm"),
					headers : {
						"Content-Type" : "application/json"
					},
					handleAs : "json"
				}).then(function(response) {
					dom.byId("changePwdForm").reset();
					if(response!=1){
						alert("更新失败，请重试或联系管理员");
					}else{
						alert("更新成功");
					}
				});
			});
		}
	};
});
