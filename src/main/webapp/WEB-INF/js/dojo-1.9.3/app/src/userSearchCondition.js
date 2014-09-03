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
        "dojo/store/Memory",
        "dojox/mobile/ComboBox",
		// not used in this module, but dependency of the demo template HTML
		"app/src/myDatePick",
		"dojox/mobile/TextBox",
		"dojox/mobile/FormLayout"
		], function(dom,on,registry,request,locale,connect,app,structure,domForm,JSON,Memory,ComboBox) {
	var internalNavRecords = [];
	
	return {
		init: function(){
			var viewId = "userSearchCondition";
			
			var powerStore = new Memory({ 
				idProperty: "id", 
				data: [
				       { name: "普通",id:1 },
				       { name: "管理员",id:10 }
				]
			});
			
			var powerComboBox = new ComboBox({
		        id: "ucpower",
		        store: powerStore,
		        searchAttr: "name",
		        onChange : app.validateCombo,
		    }, "ucpower").startup();
			
			var levelStore = new Memory({ 
				idProperty: "id", 
				data: [
				       { name: "一般",id:1 },
				       { name: "高级",id:2 }
				]
			});
			
			var levelComboBox = new ComboBox({
		        id: "uclevel",
		        store: levelStore,
		        onChange : app.validateCombo,
		        searchAttr: "name"
		    }, "uclevel").startup();
			
			on(registry.byId("ucResetBtn"), "click", function(){
				dom.byId("userConditionForm").reset();
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
			        id: "uccameraType",
			        store: cameraStore,
			        onChange : app.validateCombo,
			        searchAttr: "name"
			    }, "uccameraType").startup();
			});

			on(registry.byId("ucSearchBtn"), "click", function() {
				var user= domForm.toObject("userConditionForm");
				if(registry.byId("ucpower").get("item")){
					user['power'] = powerStore.getIdentity(registry.byId("ucpower").get("item"));
				}
				if(registry.byId("uccameraType").get("item")){
					user['cameraType'] = cameraStore.getIdentity(registry.byId("uccameraType").get("item"));
				}
				if(registry.byId("uclevel").get("item")){
					user['level'] = levelStore.getIdentity(registry.byId("uclevel").get("item"));
				}
				app.show({id: "masterList",
					title: "用户列表",
					type:"pip",// 区别开demo和navigation app.js initView
					demourl: "js/dojo-1.9.3/app/views/masterList.html",
					jsmodule: "js/dojo-1.9.3/app/src/masterList.js",
					backId: viewId,
					backTitle:"查询条件",
					url: "users",
					params : user,
					openId : "createUser",
					openTitle : "用户修改",
					openDemourl : "js/dojo-1.9.3/app/views/createUser.html",
					openJsmodule : "js/dojo-1.9.3/app/src/createUser.js",
					openBackTitle : "用户列表",
					openUrl : "user/"
				}, this);
			});
		}
	};
});
