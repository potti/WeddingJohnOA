define(["dojo/query",
	"dojo/dom",
	"dojo/on",
	"dojo/_base/connect",
	"dijit/registry",
	"dojo/request",
	"dojo/json",
	"dojo/store/Memory",
	"dojo/store/Observable",
	"app/app",
	"app/src/structure",
	"dojox/mobile/RoundRectStoreList"], 
	function(query,dom,on,connect,registry,request,JSON,Memory,Observable,app,structure){

	var value = 0;
	var label = "";
	var id = 0;
	var backWidgetId = "";
	return {
		init: function(args) {
			var self = this;
			inTransitionOrLoading = false;
			dom.byId("headerLabel").innerHTML = args.backTitle;
			var navRecords = structure.navRecords;
			navRecords.push({
				from: args.backId,
				fromTitle: args.backTitle,
				to: "selectlist",
				toTitle: "请选择",
				navTitle: args.backTitle
			});
			self.backWidgetId = args.backWidgetId;
			
			on(registry.byId("selectlist"), "beforeTransitionOut", function() {
				if(self.label){
					registry.byId(self.backWidgetId).set("label", self.label);
					registry.byId(self.backWidgetId+"Id").set("value", self.id);
				}
				structure.destoryIds.push("selectlist");
			});
			
			on(registry.byId("selectlistItems"), "checkStateChanged", function(listItem, newState) {
				if(newState){
					self.label = listItem.label;
					self.id = listItem.id;
				}
			});
			
			registry.byId("selectlistItems").set('labelProperty',args.labelProperty);
			registry.byId("selectlistItems").set('select',args.select);
			
			request.get(args.url, {
                headers: {
                    "Content-Type": "application/json"
                },
                handleAs: "json"
            }).then(function(response){
                if(response){
                	var store = Observable(new Memory({idProperty:"id",data: response}));
                	registry.byId("selectlistItems").setStore(store);
                }
            });
		}
	};
});
