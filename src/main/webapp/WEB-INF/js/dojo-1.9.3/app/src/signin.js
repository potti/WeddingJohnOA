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
		"dojox/mobile/RoundRect",
		"dojox/mobile/ListItem",
		"dojox/mobile/Switch",
		"dojox/mobile/ScrollableView"
		], function(dom,on,array,registry,request,query,locale,connect,app,structure,domForm,JSON,RoundRect,ListItem,Switch) {
	var internalNavRecords = [];
	return {
		init: function(){
			var viewId = "signin";
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
			

			request.get("schedule", {
				headers : {
					"Content-Type" : "application/json"
				},
				handleAs : "json"
			}).then(function(response) {
				array.forEach(response, function(data) {
					var empty = data.emptyDate?1:0;
					var date = data.emptyDate?data.emptyDate:data.busyDate;
					var dateStr = locale.format(new Date(date),{
						datePattern : "yyyy/MM/dd EEEE",
						selector:'date',
						locale:'zh-cn'});
					var html = "<span>" + dateStr + "</span>";
					if(data.isUse == 1){
						html += '<img alt="" src="images/hasOrder.png" class="mblImageIcon" style="position:absolute;left:15%;margin-top:-4px;"/>';
					}
					var rr = new RoundRect({
						shadow : true,
						innerHTML : html
					});
					var s = new Switch({
						isUse : data.isUse,
						date : new Date(date),
						value : empty==1?'on':'off',
						leftLabel : "有空",
						rightLabel : "没空",
						style : "float:right;",
						onTouchStart : function(evt){
							if(this.isUse == 1){
								evt.stopPropagation();
					            evt.preventDefault();
					            alert("已有订单不能修改，请致电管理员。");
							}
						},
						onStateChanged : function(newState){
							var json = {};
							if(newState == 'on'){
								json['emptyDate'] = this.date;
							}else{
								json['busyDate'] = this.date;
							}
							request.post("schedule", {
								data : JSON.stringify(json),
								headers : {
									"Content-Type" : "application/json"
								},
								handleAs : "json"
							}).then(function(response) {
								if(response != 1){
									alert("更新失败,请重新登录");
								}
							});
						}
					});
					rr.addChild(s);
					registry.byId("signin").addChild(rr);
				});
			});
		}
	};
});
