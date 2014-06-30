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
			
			on(registry.byId("selectlist"), "beforeTransitionOut", function() {
				var navRecords = structure.navRecords;
				internalNavRecords = [];
				for (var i = 0; i < navRecords.length ; ++ i) {
					var navRecord = navRecords[i];
					if (navRecord.from == "navigation" ||
						navRecord.to == "source")
						continue;
					internalNavRecords.push(navRecord);
				};
				alert(self.label);
				this.destroyRecursive();
			});
			
			on(registry.byId("selectlistItems"), "checkStateChanged", function(listItem, newState) {
				if(newState){
					self.label = listItem.label;
				}
			});
		}
	};
});
