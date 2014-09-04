define(["dojo/dom",
        "dojo/dom-construct",
        "dojo/on",
        "dojo/_base/array",
        "dijit/registry",
        "dojo/request",
        "dojo/query",
        "dojo/date/locale",
        "dojo/_base/connect",
        "app/app",
        "app/src/structure",
        "dojo/dom-form",
        "dojo/json",
        "dojo/store/Memory",
        "dojox/mobile/ComboBox",
		"dojox/mobile/TextArea",// not used in this module, but dependency of the demo template HTML
		"dojox/mobile/TextBox",
		"dojox/mobile/RadioButton",
		"app/src/myDatePick",
		"dojox/mobile/TextArea",
		"dojox/mobile/FormLayout",
		"dijit/form/Form"
		], function(dom,domConstruct,on,array,registry,request,query,locale,connect,app,structure,domForm,JSON,
				Memory,ComboBox) {
	var internalNavRecords = [];
	return {
		init: function(args){
			var skills = [];
			var viewId = "createCamera";
			var self = this;
			on(registry.byId("cameraresetBtn"), "click", function(){
				dom.byId("createCameraForm").reset();
			});
			
			connect.subscribe("onAfterDemoViewTransitionIn", function(id) {
				if (id == viewId) {
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

			on(registry.byId("cameracusubmitBtn"), "click", function() {
						var camera = domForm.toObject("createCameraForm");
						
						if(!app.formValidate(camera,"camera")){
							return;
						}
						
						if(camera["id"]){
							//update
							request.put("camera", {
								data : JSON.stringify(camera),
								headers : {
									"Content-Type" : "application/json"
								},
								handleAs : "json"
							}).then(function(response) {
								if(response!=1){
									alert("更新失败，请重试或联系管理员");
								}else{
									alert("更新成功");
								}
							});
						}else{
							//create
							request.post("camera", {
								data : JSON.stringify(camera),
								headers : {
									"Content-Type" : "application/json"
								},
								handleAs : "json"
							}).then(function(response) {
								if(response != -1){
									registry.byId("cameraId").set('value', response);
									registry.byId("cameradelBtn").set('disabled', false);
									alert("创建成功");
								}else{
									alert("创建失败，请重试或联系管理员");
								}
							});
						}
					});
			
			on(registry.byId("cameradelBtn"), "click", function(){
				var delid = registry.byId("cameraId").get('value');
				if(delid.length <= 0){
					return;
				}
				request.del("camera/" + delid, {
					headers : {
						"Content-Type" : "application/json"
					},
					handleAs : "json"
				}).then(function(response) {
					if(response == 1){
						app.back();
						connect.publish("onAfterDeleteCallBack", ["masterList",delid]);
					}else{
						alert("删除失败，请重试或联系管理员");
					}
				});
			});
			
			// ************************************ update时的界面  **********************************************
			if(args && args.itemId){
				var navRecords = structure.navRecords;
				navRecords.push({
					delTo : true,
					from: args.backId,
					fromTitle: args.backTitle,
					to: args.id,
					toTitle: args.title,
					navTitle: args.backTitle
				});
				
				registry.byId("cameraId").set('value', args.itemId);
				registry.byId("cameradelBtn").set('disabled', false);
				request.get(args.url, {
					headers : {
						"Content-Type" : "application/json"
					},
					handleAs : "json"
				}).then(function(response) {
					if(response){
						registry.byId("cameraname").set('value', response.name);
					}
				});
			}
			// ************************************ update时的界面  **********************************************
		}
	};
});
