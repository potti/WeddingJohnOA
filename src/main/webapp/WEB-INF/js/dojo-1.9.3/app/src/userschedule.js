define(["dojo/dom",
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
		"dijit/CalendarLite",
		"app/src/myCalendar",
		], function(dom,on,array,registry,request,query,locale,connect,app,structure,domForm,JSON,CalendarLite,MyCalendar) {
	var internalNavRecords = [];
	return {
		init: function(){
			var viewId = "userschedule";
			var self = this;
			
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
			var month = null;
			var userCalendar = new MyCalendar({
				id : "userCalendar",
				monthChange : function(value){
					var newMonth = locale.format(value, {datePattern : 'yyyyMM', selector:'date'});
					if(month != newMonth){
						month = newMonth;
						request.get("allSchedule/" + newMonth, {
							headers : {
								"Content-Type" : "application/json"
							},
							handleAs : "json"
						}).then(function(response) {
							if(JSON.stringify(response).length > 2){
								userCalendar.reRender(response);
							}
						});
					}
				}
			});
			registry.byId("userschedule").addChild(userCalendar);
		}
	};
});
