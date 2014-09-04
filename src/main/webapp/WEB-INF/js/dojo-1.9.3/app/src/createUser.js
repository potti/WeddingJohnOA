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
			var viewId = "createUser";
			var self = this;
			on(registry.byId("curesetBtn"), "click", function(){
				dom.byId("createUserForm").reset();
			});
			
			var powerStore = new Memory({ 
				idProperty: "id", 
				data: [
				       { name: "普通",id:1 },
				       { name: "管理员",id:10 }
				]
			});
			
			var powerComboBox = new ComboBox({
		        id: "cupower",
		        store: powerStore,
		        searchAttr: "name",
		        onChange : app.validateCombo,
		    }, "cupower").startup();
			
			var levelStore = new Memory({ 
				idProperty: "id", 
				data: [
				       { name: "一般",id:1 },
				       { name: "高级",id:2 }
				]
			});
			
			var levelComboBox = new ComboBox({
		        id: "culevel",
		        store: levelStore,
		        onChange : app.validateCombo,
		        searchAttr: "name"
		    }, "culevel").startup();
			
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

			on(registry.byId("cusubmitBtn"), "click", function() {
						var user = domForm.toObject("createUserForm");
						
						if(!app.formValidate(user,"cu")){
							return;
						}
						
						if(registry.byId("cupower").get("item")){
							user['power'] = powerStore.getIdentity(registry.byId("cupower").get("item"));
						}else{
							alert("请正确填写信息...");
							registry.byId("cupower").focus();
							return;
						}
						if(registry.byId("cucameraType").get("item")){
							user['cameraType'] = cameraStore.getIdentity(registry.byId("cucameraType").get("item"));
						}else{
							alert("请正确填写信息...");
							registry.byId("cucameraType").focus();
							return;
						}
						if(registry.byId("culevel").get("item")){
							user['level'] = levelStore.getIdentity(registry.byId("culevel").get("item"));
						}else{
							alert("请正确填写信息...");
							registry.byId("culevel").focus();
							return;
						}
						if(user["id"]){
							//update
							request.put("user", {
								data : JSON.stringify(user),
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
							request.post("user", {
								data : JSON.stringify(user),
								headers : {
									"Content-Type" : "application/json"
								},
								handleAs : "json"
							}).then(function(response) {
								if(response != -1){
									registry.byId("userId").set('value', response);
									registry.byId("cudelBtn").set('disabled', false);
									alert("创建成功");
								}else{
									alert("创建失败，请重试或联系管理员");
								}
							});
						}
					});
			
			var cameraStore;
			request.get("cameras", {
				headers : {
					"Content-Type" : "application/json"
				},
				handleAs : "json"
			}).then(function(response) {
				cameraStore = new Memory({ 
					idProperty: "id", 
					data: response
				});
				
				var cameraComboBox = new ComboBox({
			        id: "cucameraType",
			        store: cameraStore,
			        onChange : app.validateCombo,
			        searchAttr: "name"
			    }, "cucameraType").startup();
			});
			
			on(registry.byId("cudelBtn"), "click", function(){
				var delid = registry.byId("userId").get('value');
				if(delid.length <= 0){
					return;
				}
				request.del("user/" + delid, {
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
				
				registry.byId("userId").set('value', args.itemId);
				registry.byId("cudelBtn").set('disabled', false);
				request.get(args.url, {
					headers : {
						"Content-Type" : "application/json"
					},
					handleAs : "json"
				}).then(function(response) {
					if(response){
						registry.byId("cuaccount").set('value', response.account);
						registry.byId("cuname").set('value', response.name);
						registry.byId("cuno").set("value", response.no);
						registry.byId("cupower").set("item", registry.byId("cupower").get("store").get(response.power));
						registry.byId("cutel").set("value", response.tel);
						registry.byId("cumail").set("value", response.mail);
						registry.byId("culevel").set("item", registry.byId("culevel").get("store").get(response.level));
						registry.byId("cuprice").set("value", response.price);
						registry.byId("curemark").set("value", response.remark);
						
						var int = setInterval(function(){
							if(registry.byId("cucameraType")){
								registry.byId("cucameraType").set("item", registry.byId("cucameraType").get("store").get(response.cameraType));
								clearInterval(int);
							}
						},20);
					}
				});
			}
			// ************************************ update时的界面  **********************************************
		}
	};
});
