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
    	"dojox/mobile/SwapView",
    	"dojox/mobile/PageIndicator",
    	"dojox/mobile/RoundRectList",
    	"dojox/mobile/ListItem"
		], function(dom,on,array,registry,request,query,locale,connect,app,structure,domForm,JSON,SwapView,PageIndicator,
				RoundRectList,ListItem) {
	var internalNavRecords = [];
	return {
		init: function(args){
			var viewId = "masterList";
			var prefix = viewId+"-";
			var navRecords = structure.navRecords;
			navRecords.push({
				delTo : true,
				from: args.backId,
				fromTitle: args.backTitle,
				to: args.id,
				toTitle: args.title,
				navTitle: args.backTitle
			});
			var displayLabel = args.displayLabel ? args.displayLabel : "name";
			
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
			
			connect.subscribe("onAfterDeleteCallBack", function(id, delid) {
				if (id == viewId) {
					if(registry.byId(prefix + "id-" + delid)){
						registry.byId(prefix + "id-" + delid).destroyRecursive();
					}
				}
			});
			
			request.post(args.url, {
				data : JSON.stringify(args.params),
				headers : {
					"Content-Type" : "application/json"
				},
				handleAs : "json"
			}).then(function(response) {
				if(response.pages == 0){
					return;
				}
				for(var i=1;i<=response.pages;i++){
					if(!registry.byId(prefix+i)){
						var aSwapView = new SwapView({
							id:prefix + i
						});
						registry.byId(viewId).addChild(aSwapView);
					}
				}
				var aPageIndicator = new PageIndicator({
//					fixed : "bottom",
					style : "position:fixed;bottom:20px;left:8%"
				});
				registry.byId(viewId).addChild(aPageIndicator);
				aPageIndicator.startup();
				
				var page = 1;
				var index = 1;
				var aRoundRectList = new RoundRectList();
				var pageView = registry.byId(prefix+page);
				array.forEach(response.datas,function(data){
					if(index > 10*page){
						page ++;
						aRoundRectList = new RoundRectList();
						pageView = registry.byId(prefix+page);
					}
					var aListItem = new ListItem({
						id : prefix + "id-" + data.id,
						itemId : data.id,
						label : data[displayLabel],
						clickable : true,
						onClick : function(e){
							app.show({id: args.openId,
								title: args.openTitle,
								type:"pip",
								demourl: args.openDemourl,
								jsmodule: args.openJsmodule,
								backId: viewId,
								backTitle:args.openBackTitle,
								itemId : this.itemId,
								url: args.openUrl + this.itemId}, this);
						}
					});
					aRoundRectList.addChild(aListItem);
					if(index == 10*page || index == response.datas.length){
						pageView.addChild(aRoundRectList);
					}
					index ++;
				});
			});
		}
	};
});
