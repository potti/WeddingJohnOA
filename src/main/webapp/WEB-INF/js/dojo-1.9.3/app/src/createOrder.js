define(["dojo/dom","dojo/on",
        "dijit/registry",
        "dojo/query",
        "dojo/date/locale",
        "dojo/_base/connect",
        "app/app",
        "app/src/structure",
		"dojox/mobile/TextBox",// not used in this module, but dependency of the demo template HTML
		"dojox/mobile/TextArea",
		"dojox/mobile/CheckBox",
		"dojox/mobile/RadioButton",
		"dojox/mobile/Opener",
		"dojox/mobile/Heading",
		"dojox/mobile/SpinWheelDatePicker",
		"dojox/mobile/ListItem",
		"dojox/mobile/RoundRectList",
		"dojox/mobile/FormLayout"], function(dom,on,registry,query,locale,connect,app,structure) {
	
	var internalNavRecords = [];
	return {
		init: function(){
			var self = this;
			on(registry.byId("resetBtn"), "click", function(){
				// roll back all form inputs
				dom.byId("testForm").reset();
			});
			
			var today = locale.format(new Date(), {datePattern: "yyyy-MM-dd", selector: "date"});
			registry.byId("startDate").set('value', today);
			registry.byId("spin1").set("value", today);
			//***********时间控件********************
			on(registry.byId("startDate"), "click", function(){
				registry.byId('datePicker').show(this, ['above-centered','below-centered','after','before']);
			});
			
			on(registry.byId("datePicker"), "hide", function(node, v){
				if(v === true){ // Done clicked
					registry.byId("startDate").set('value', registry.byId("spin1").get("value"));
				}
			});
			
			on(registry.byId("datePicker"), "show", function(node){
				var v = registry.byId("startDate").get("value").split(/-/);
				if(v.length == 3){
					var w = registry.byId("spin1");
					w.set("values", v);
				}
			});
			
			on(registry.byId("doneBtn"), "click", function(){
				registry.byId('datePicker').hide(true);
			});
			
			on(registry.byId("cancelBtn"), "hide", function(){
				registry.byId('datePicker').hide(false);
			});
			//************************************
			on(registry.byId("companySelect"), "click", function(){
			    app.show({id: "selectlist",
					title: "选择",
					type:"once",// 区别开demo和navigation app.js initView
					demourl: this.moveToUrl,
					jsmodule: this.jsmodule,
					backId:"createOrder",
					backTitle:"订单",
					backWidgetId:"companySelect"}, this);
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
