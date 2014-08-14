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
		"app/src/myDatePick",
		"dojox/mobile/TextBox",
		"dojox/mobile/FormLayout"
		], function(dom,on,registry,request,locale,connect,app,structure,domForm,JSON) {
	var internalNavRecords = [];
	return {
		init: function(){
			var viewId = "orderSearchCondition";
			var self = this;
			on(registry.byId("ocResetBtn"), "click", function(){
				dom.byId("orderConditionForm").reset();
			});
			on(registry.byId("occompany"), "click", function(){
			    app.show({id: "selectlist",
					title: "请选择",
					type:"once",// 区别开demo和navigation app.js initView
					demourl: this.moveToUrl,
					jsmodule: this.jsmodule,
					backId: viewId,
					backTitle:"订单",
					backWidgetId:"occompany",
					select:"single",
					labelProperty:"companyName",
					url: "company" }, this);
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
			
			registry.byId("ocstartDate").reset();
			registry.byId("ocendDate").reset();

			on(registry.byId("ocSearchBtn"), "click", function() {
				var order = domForm.toObject("orderConditionForm");
				order['startDate'] = registry.byId("ocstartDate").domNode.value;
				order['endDate'] = registry.byId("ocendDate").domNode.value;
				app.show({id: "orderList",
					title: "订单",
					type:"pip",// 区别开demo和navigation app.js initView
					demourl: "js/dojo-1.9.3/app/views/orderList.html",
					jsmodule: "js/dojo-1.9.3/app/src/orderList.js",
					backId: viewId,
					backTitle:"查询条件",
					url: "getOrders",
					params : order}, this);
			});
		}
	};
});
