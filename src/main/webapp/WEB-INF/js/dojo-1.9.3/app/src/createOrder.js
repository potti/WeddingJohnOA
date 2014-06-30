define(["dojo/dom","dojo/on",
        "dijit/registry",
        "dojo/query",
        "dojo/_base/connect",
        "app/app",
        "app/src/structure",
		"dojox/mobile/TextBox",// not used in this module, but dependency of the demo template HTML
		"dojox/mobile/TextArea",
		"dojox/mobile/CheckBox",
		"dojox/mobile/RadioButton",
		"dojox/mobile/Slider",
		"dojox/mobile/ListItem",
		"dojox/mobile/RoundRectList",
		"dojox/mobile/FormLayout"], function(dom, on, registry, query, connect, app, structure) {
	
	var internalNavRecords = [];
	return {
		init: function(){
			var self = this;
			registry.byId("alertSlider").focus = function(){};
			on(registry.byId("resetBtn"), "click", function(){
				// roll back all form inputs
				dom.byId("testForm").reset();
			});
			
			on(registry.byId("companySelect"), "click", function(){
			    app.show({id: "selectlist",
					title: "选择",
					type:"once",// 区别开demo和navigation app.js initView
					demourl: this.moveToUrl,
					jsmodule: this.jsmodule,
					backId:"createOrder",
					backTitle:"订单"}, this);
			});
			
			connect.subscribe("onAfterDemoViewTransitionIn", function(id) {
				if (id == "createOrder") {
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
		}
	};
});
