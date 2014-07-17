define(["dojo/_base/declare",
    "dojo/aspect",
    "dojo/query",
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
	"dojox/mobile/RoundRectStoreList",
	"dojox/mobile/FilteredListMixin",
	"dojox/mobile/SearchBox"], 
	function(declare,aspect,query,dom,on,connect,registry,request,JSON,Memory,Observable,app,structure,RoundRectStoreList,FilteredListMixin){

	var internalNavRecords=[];
	return {
		values : [],
		backWidgetId : "",
		init: function(args) {
			var self = this;
			inTransitionOrLoading = false;
//			dom.byId("headerLabel").innerHTML = args.backTitle;
//			var navRecords = structure.navRecords;
//			navRecords.push({
//				from: args.backId,
//				fromTitle: args.backTitle,
//				to: "multiselectlist",
//				toTitle: "请选择",
//				navTitle: args.backTitle
//			});
//			self.backWidgetId = args.backWidgetId;
			
//			on(registry.byId("multiselectlist"), "beforeTransitionOut", function() {
//				if(self.label){
//					registry.byId(self.backWidgetId).set("label", self.label);
//					registry.byId(self.backWidgetId+"Id").set("value", self.id);
//				}
//				structure.destoryIds.push("multiselectlist");
//			});
			
			request.get("skill", {
                headers: {
                    "Content-Type": "application/json"
                },
                handleAs: "json"
            }).then(function(response){
                if(response){
                	var store = Observable(new Memory({idProperty:"id",data: response}));
                	var view = registry.byId("multiselectlistItems");
    				var listWidget =
    					new declare([RoundRectStoreList, FilteredListMixin])({
    							labelProperty:'name',
    							select : 'multiple',
    							placeHolder:'查询',
    							store: store});
    				listWidget.placeAt(view.containerNode);
    				listWidget.startup();
    				var filterBox = listWidget.getFilterBox();
    				filterBox.set("queryExpr", "*${0}*");
    				
    				aspect.after(listWidget, "generateList", function(){
    					if(this.getChildren().length>0){
    						for(var i=0;i<this.getChildren().length;i++){
    							var d = this.getChildren()[i];
    							if(!d.checked){
    								alert(d.domNode.id);
    							}
    						}
    					}
    				});
    				
    				on(listWidget, "checkStateChanged", function(listItem, newState) {
    					if(newState){
    						var d = {
    							id : listItem.id,
    							label : listItem.label
    						};
    						self.values.push(d);
    					}else{
    						for(var i=0;i<self.values.length;i++){
    							if(self.values[i] && self.values[i].id == listItem.id){
    								delete self.values[i];
    								break;
    							}
    						}
    					}
    				});
                }
            });
			
			connect.subscribe("onAfterDemoViewTransitionIn", function(id) {
				if (id == "multiselectlist") {
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
			on(registry.byId("multiselectlist"), "beforeTransitionOut", function() {
				var navRecords = structure.navRecords;
				internalNavRecords = [];
				for (var i = 0; i < navRecords.length ; ++ i) {
					var navRecord = navRecords[i];
					if (navRecord.from == "navigation" ||
						navRecord.to == "source")
						continue;
					internalNavRecords.push(navRecord);
				};
			});
		}
	};
});
