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
			var viewId = "cameraSearchCondition";
			var self = this;
			
			on(registry.byId("cscResetBtn"), "click", function(){
				dom.byId("cameraConditionForm").reset();
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
			
			on(registry.byId("cscSearchBtn"), "click", function() {
				var camera = domForm.toObject("cameraConditionForm");
				app.show({id: "masterList",
					title: "器材列表",
					type:"pip",// 区别开demo和navigation app.js initView
					demourl: "js/dojo-1.9.3/app/views/masterList.html",
					jsmodule: "js/dojo-1.9.3/app/src/masterList.js",
					backId: viewId,
					backTitle:"查询条件",
					url: "cameras",
					params : camera,
					openId : "createCamera",
					openTitle : "器材修改",
					openDemourl : "js/dojo-1.9.3/app/views/createCamera.html",
					openJsmodule : "js/dojo-1.9.3/app/src/createCamera.js",
					openBackTitle : "器材列表",
					openUrl : "camera/"
				}, this);
			});
		}
	};
});
