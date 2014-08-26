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
    	"dojox/mobile/ListItem",
    	"dojox/mobile/TextBox"
		], function(dom,on,array,registry,request,query,locale,connect,app,structure,domForm,JSON,SwapView,PageIndicator,
				RoundRectList,ListItem) {
	var internalNavRecords = [];
	return {
		init: function(args){
			var viewId = "myOrderList";
			
//			on(registry.byId("myOrderList"), "beforeTransitionOut", function() {
//				structure.destoryIds.push("myOrderList");
//			});
			
			connect.subscribe("initData", function(id) {
				if (id == viewId) {
					request.get("myFOrders", {
						headers : {
							"Content-Type" : "application/json"
						},
						handleAs : "json"
					}).then(function(response) {
						if(response.pages == 0){
							alert("您没有未拍订单!");
							return;
						}
						for(var i=1;i<=response.pages;i++){
							if(!registry.byId(viewId + "-" + i)){
								var aSwapView = new SwapView({
									id:viewId + "-"+ i
								});
								registry.byId(viewId).addChild(aSwapView);
							}
						}
						var aPageIndicator = new PageIndicator({
//							fixed : "bottom",
							style : "position:fixed;bottom:20px;left:8%"
						});
						registry.byId(viewId).addChild(aPageIndicator);
						aPageIndicator.startup();
						
						var page = 1;
						var index = 1;
						var aRoundRectList = new RoundRectList();
						var pageView = registry.byId(viewId + "-"+page);
						array.forEach(response.datas,function(data){
							if(index > 10*page){
								page ++;
								aRoundRectList = new RoundRectList();
								pageView = registry.byId(viewId + "-"+page);
							}
							var aListItem = new ListItem({
								orderId : data.id,
								label : data.companyName + "---" + locale.format(data.startDate, {datePattern: "yyyy-MM-dd", selector: "date"}),
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
			});
			
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
		}
	};
});
