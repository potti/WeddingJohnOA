define(["dojo/query",
	"dojo/dom",
	"dojo/dom-style",
	"dojo/on",
	"dojo/_base/connect",
	"dijit/registry",
	"app/app",
	"app/src/structure"], function(query, dom, style, on, connect, registry, app, structure){

	var value = 0;
	var label = "";
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
				toTitle: "选择",
				navTitle: args.backTitle
			});
			self.backWidgetId = args.backWidgetId;
			
			on(registry.byId("selectlist"), "beforeTransitionOut", function() {
				registry.byId(self.backWidgetId).set("label", self.label);
				structure.destoryIds.push("selectlist");
			});
			
			on(registry.byId("selectlistItems"), "checkStateChanged", function(listItem, newState) {
				if(newState){
					self.label = listItem.label;
				}
			});
		}
	};
});
