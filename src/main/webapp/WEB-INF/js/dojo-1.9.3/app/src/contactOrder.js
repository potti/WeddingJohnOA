define(["dojo/dom",
        "dojo/dom-construct",
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
        "dojox/mobile/Pane",
		"dojox/mobile/TextBox",
		"dojox/mobile/GridLayout",
		"dojox/mobile/RoundRectList",
		"dojox/mobile/ListItem",
		"dojox/mobile/CheckBox",
		"app/src/myValuePick",
		"dojox/mobile/TextArea",// not used in this module, but dependency of the demo template HTML
		"dojox/mobile/RadioButton",
		"app/src/myDatePick",
		"dojox/mobile/FormLayout"
		], function(dom,domConstruct,on,array,registry,request,query,locale,connect,app,structure,domForm,JSON,Pane,TextBox,GridLayout,
				RoundRectList,ListItem,CheckBox,MyValuePick) {
	var internalNavRecords = [];
	return {
		init: function(args){
			var skills = [];
			var viewId = "contactOrder";
			var self = this;
			
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

			on(registry.byId("contactBtn"), "click", function() {
						var order = domForm.toObject("contactOrderForm");
						if(order['id']){
							//update
							request.put("contact/" + order['id'], {
								headers : {
									"Content-Type" : "application/json"
								},
								handleAs : "json"
							}).then(function(response) {
								if(response!=1){
									alert("更新失败，请重试或联系管理员");
								}else{
									registry.byId("contactBtn").set("disabled","disabled");
									alert("更新成功");
								}
							});
						}
					});
			
			request.get("skill", {
				headers : {
					"Content-Type" : "application/json"
				},
				handleAs : "json"
			}).then(function(response) {
				array.forEach(response,function(data){
					skills.push(data.id);
					var g0 = new GridLayout({
						cols:2
					});
					var p0 = new Pane({
						innerHTML: data.name + " : "
					});
					p0.domNode.style.width = "15%";
					g0.addChild(p0);
					var t0 = new MyValuePick({
						id : "coskill-" + data.id,
						disable : false,
						dateChange : function(newValue) {
							var oldValue = this.defaultValue?this.defaultValue:0;
							var parent = this.getParent();
							var index = registry.byId("coarrengment").getIndexOfChild(parent);
							var rr;
							if(registry.byId("coarrengment").getChildren().length > index + 1){
								array.forEach(registry.byId("coarrengment").getChildren(), function(child, ind) {
									if(ind == index + 1 && child.baseClass != parent.baseClass){
										rr = child;
										return;
									}
								}); 
							}
							if(newValue > oldValue){
								if(!rr){
									rr = new RoundRectList({
										editable:false
									});
								}
								var start = rr.getChildren().length;
								var end = start + (newValue-oldValue);
								for(var j=start;j<end;j++){
									var txtid = "coskill-" + data.id + "-" + j;
									var checkBox = new CheckBox({
										id:txtid+"cb",
										readOnly : true
									});
									var textbox = new TextBox({
										type:'hidden',
										id:txtid+"Id",
									});
									var li = new ListItem({
										id:txtid,
										clickable:false
									});
									rr.addChild(checkBox);// 3个控件
									rr.addChild(textbox);
									rr.addChild(li);
								}
								registry.byId("coarrengment").addChild(rr,index+1);
							}
							this.defaultValue = newValue;
						}
					});
					g0.addChild(t0);
					// 加一行空行 不然会重叠
					var br = domConstruct.create("br");
					br.className = "mblGridItemTerminator";
					g0.domNode.appendChild(br);
					// 加一行空行 不然会重叠
					registry.byId("coarrengment").addChild(g0);
			    });
			});
			
			// ************************************ update时的界面  **********************************************
			if(args && args.orderId){
				var navRecords = structure.navRecords;
				navRecords.push({
					delTo : true,
					from: args.backId,
					fromTitle: args.backTitle,
					to: args.id,
					toTitle: args.title,
					navTitle: args.backTitle
				});
				
				registry.byId("coorderId").set('value', args.orderId);
				request.get(args.url, {
					headers : {
						"Content-Type" : "application/json"
					},
					handleAs : "json"
				}).then(function(response) {
					if(response){
						var orderInfo = response.orderInfo;
						registry.byId("coorderNo").set('value', orderInfo.orderNo);
						registry.byId("cocompany").set("value", response.companyName);
						registry.byId("costartDate").set("value", locale.format(new Date(orderInfo.startDate), {datePattern: "yyyy-MM-dd", selector: "date"}));
						registry.byId("coendDate").set("value", locale.format(new Date(orderInfo.endDate), {datePattern: "yyyy-MM-dd", selector: "date"}));
						registry.byId("coprice").set("value", orderInfo.price);
						registry.byId("counit").set("value", orderInfo.unit);
						registry.byId("cooverPirce").set("value", orderInfo.overPirce);
						var nowpay = query("[name=copayType]")[0];
						var aftpay = query("[name=copayType]")[1];
						if(orderInfo.payType === 1){
							registry.byId(nowpay.id).set('checked', true);
							registry.byId(aftpay.id).set('checked', false);
						}else{
							registry.byId(nowpay.id).set('checked', false);
							registry.byId(aftpay.id).set('checked', true);
						}
						var nowpay1 = query("[name=cooverPayType]")[0];
						var aftpay1 = query("[name=cooverPayType]")[1];
						if(orderInfo.overPayType === 1){
							registry.byId(nowpay1.id).set('checked', true);
							registry.byId(aftpay1.id).set('checked', false);
						}else{
							registry.byId(nowpay1.id).set('checked', false);
							registry.byId(aftpay1.id).set('checked', true);
						}
						registry.byId("coweddinginfo").set("value", orderInfo.weddinginfo);
						if(response.isContact != 0){
							registry.byId("contactBtn").set("disabled","disabled");
						}
						if(orderInfo.needman.length > 0){
							var type = orderInfo.needman.split(";");
							for(var i=0;i<type.length;i++){
								var tmp = type[i].split(":");
								registry.byId("coskill-" + tmp[0]).setValue(tmp[1]);
							}
							
							var int = setInterval(function(){
								var success = true;
								var contactMans;
								if(orderInfo.contactMan && orderInfo.contactMan.length > 0){
									contactMans = orderInfo.contactMan.split(";");
								}
								for(var i=0;i<type.length;i++){
									var tmp = type[i].split(":");
									if(tmp.length > 2 && tmp[2].length > 0){
										var users = tmp[2].split("-");
										for(var j=0;j<users.length;j++){
											var txtid = "coskill-" + tmp[0] + "-" + j;
											var userId = users[j];
											var userName = response["user-" + users[j]];
											if(!registry.byId(txtid + "Id") || !registry.byId(txtid)){
												success = false;
												break;
											}else{
												registry.byId(txtid + "Id").set("value", userId);
												registry.byId(txtid).set("label", userName);
												if(contactMans){
													for(var k=0;k<contactMans.length;k++){
														if(contactMans[k] === userId){
															registry.byId(txtid + "cb").set("checked", true);
															break;
														}
													}
												}
											}
										}
									}
									if(!success){
										break;
									}
								}
								if(success){
									clearInterval(int);
								}
							},100);
						}
					}
				});
			}
			// ************************************ update时的界面  **********************************************
		}
	};
});
