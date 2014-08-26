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
			var viewId = "orderList";
			var navRecords = structure.navRecords;
			navRecords.push({
				delTo : true,
				from: args.backId,
				fromTitle: args.backTitle,
				to: args.id,
				toTitle: args.title,
				navTitle: args.backTitle
			});
			
//			on(registry.byId("orderList"), "beforeTransitionOut", function() {
//				structure.destoryIds.push("orderList");
//			});
			
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
					if(!registry.byId("orderList-"+i)){
						var aSwapView = new SwapView({
							id:"orderList-"+ i
						});
						registry.byId("orderList").addChild(aSwapView);
					}
				}
				var aPageIndicator = new PageIndicator({
//					fixed : "bottom",
					style : "position:fixed;bottom:20px;left:8%"
				});
				registry.byId("orderList").addChild(aPageIndicator);
				aPageIndicator.startup();
				
				var page = 1;
				var index = 1;
				var aRoundRectList = new RoundRectList();
				var pageView = registry.byId("orderList-"+page);
				array.forEach(response.datas,function(data){
					if(index > 10*page){
						page ++;
						aRoundRectList = new RoundRectList();
						pageView = registry.byId("orderList-"+page);
					}
					var aListItem = new ListItem({
						orderId : data.id,
						label : data.id + "---" + data.orderNo,
						clickable : true,
						onClick : function(e){
							app.show({id: "createOrder",
								title: "订单修改",
								type:"pip",
								demourl: "js/dojo-1.9.3/app/views/createOrder.html",
								jsmodule: "js/dojo-1.9.3/app/src/createOrder.js",
								backId: viewId,
								backTitle:"查找订单",
								orderId : this.orderId,
								url: "order/" + this.orderId}, this);
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
