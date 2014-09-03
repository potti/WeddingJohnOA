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
			var viewId = "companySearchCondition";
			
			var typeStore = new Memory({ 
				idProperty: "id", 
				data: [
				       { name: "类别1",id:1 },
				       { name: "类别2",id:2 }
				]
			});
			
			var typeComboBox = new ComboBox({
		        id: "cscompany_type",
		        store: typeStore,
		        searchAttr: "name",
		        onChange : app.validateCombo,
		    }, "cscompany_type").startup();
			
			var levelStore = new Memory({ 
				idProperty: "id", 
				data: [
				       { name: "一般",id:1 },
				       { name: "中等",id:2 },
				       { name: "重要",id:3 }
				]
			});
			
			var levelComboBox = new ComboBox({
		        id: "cscompany_level",
		        store: levelStore,
		        onChange : app.validateCombo,
		        searchAttr: "name"
		    }, "cscompany_level").startup();
			
			on(registry.byId("companySearchResetBtn"), "click", function(){
				dom.byId("companyConditionForm").reset();
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
			
			on(registry.byId("companySearchBtn"), "click", function() {
				var company= domForm.toObject("companyConditionForm");
				if(registry.byId("cscompany_type").get("item")){
					company['type'] = typeStore.getIdentity(registry.byId("cscompany_type").get("item"));
				}
				if(registry.byId("cscompany_level").get("item")){
					company['level'] = levelStore.getIdentity(registry.byId("cscompany_level").get("item"));
				}
				app.show({id: "masterList",
					title: "客户列表",
					type:"pip",// 区别开demo和navigation app.js initView
					demourl: "js/dojo-1.9.3/app/views/masterList.html",
					jsmodule: "js/dojo-1.9.3/app/src/masterList.js",
					backId: viewId,
					backTitle:"查询条件",
					url: "companys",
					params : company,
					displayLabel : "companyName",
					openId : "createCompany",
					openTitle : "客户修改",
					openDemourl : "js/dojo-1.9.3/app/views/createCompany.html",
					openJsmodule : "js/dojo-1.9.3/app/src/createCompany.js",
					openBackTitle : "客户列表",
					openUrl : "company/"
				}, this);
			});
		}
	};
});
