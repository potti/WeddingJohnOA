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
        "dojox/mobile/Pane",
		"dojox/mobile/TextBox",
		"dojox/mobile/GridLayout",
		"dojox/mobile/RoundRectList",
		"dojox/mobile/ListItem",
		"dojox/mobile/CheckBox",
		"dojox/mobile/TextArea",// not used in this module, but dependency of the demo template HTML
		"dojox/mobile/RadioButton",
		"app/src/myDatePick",
		"dojox/mobile/FormLayout"
		], function(dom,on,array,registry,request,query,locale,connect,app,structure,domForm,JSON,Pane,TextBox,GridLayout,
				RoundRectList,ListItem,CheckBox) {
	var internalNavRecords = [];
	return {
		init: function(args){
			var skills = [];
			var viewId = "createOrder";
			var self = this;
			on(registry.byId("resetBtn"), "click", function(){
				dom.byId("createOrderForm").reset();
				dom.byId("createOrderDetailForm").reset();
			});
			on(registry.byId("company"), "click", function(){
			    app.show({id: "selectlist",
					title: "请选择",
					type:"once",// 区别开demo和navigation app.js initView
					demourl: this.moveToUrl,
					jsmodule: this.jsmodule,
					backId: viewId,
					backTitle:"订单",
					backWidgetId:"company",
					select:"single",
					labelProperty:"companyName",
					url: "company" }, this);
			});
			
			registry.byId("startDate").set("dateChange", function(newValue){
				registry.byId("endDate").setDateStr(newValue);
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

			on(registry.byId("submitBtn"), "click", function() {
						var needMan = "";
						var contactMan = "";
						for(var s in skills){
							var skillId = skills[s];
							var max = registry.byId("skill-" + skillId).get('value');
							if(max && max > 0){
								if(needMan.length > 0){
									needMan +=";";
								}
								needMan +=skillId + ":" + max + ":";
								var mannum = 0;
								for(var i=0;i<max;i++){
									var txtid = "skill-" + skillId + "-" + i;
									var txt = registry.byId(txtid + "Id");
									if(txt && txt.get('value')){
										if(mannum > 0){
											needMan += "-";
										}
										needMan += txt.get('value');
										mannum++;
									}
									var cb = registry.byId(txtid+"cb");
									if(txt && cb && cb.get('checked')){
										if(contactMan.length > 0){
											contactMan +=";";
										}
										contactMan += txt.get('value');
									}
								}
							}
						}
						var order = domForm.toObject("createOrderForm");
						order['startDate'] = registry.byId("startDate").domNode.value;
						order['endDate'] = registry.byId("endDate").domNode.value;
						order['needman'] = needMan;
						if(contactMan.length > 0){
							order['contactMan'] = contactMan;
						}
						if(needMan.length === 0){
							alert('请填写人员需求');
							return;
						}
						var orderDetail = domForm.toObject("createOrderDetailForm");
						if(orderDetail['orderDetail'].length <= 1){
							orderDetail['orderDetail'] = [orderDetail['orderDetail']];
						}
						orderDetail['orderInfo'] = order;
						if(order['id']){
							//update
							request.put("order", {
								data : JSON.stringify(orderDetail),
								headers : {
									"Content-Type" : "application/json"
								},
								handleAs : "json"
							}).then(function(response) {
								if(response!=1){
									alert("更新失败，请重试或联系管理员");
								}else{
									alert("更新成功");
								}
							});
						}else{
							//create
							request.post("order", {
								data : JSON.stringify(orderDetail),
								headers : {
									"Content-Type" : "application/json"
								},
								handleAs : "json"
							}).then(function(response) {
								if(response != -1){
									registry.byId("orderId").set('value', response);
									alert("创建成功");
								}else{
									alert("创建失败，请重试或联系管理员");
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
					var t0 = new TextBox({
						id : "skill-" + data.id,
						maxLength : 1
					});
					t0.domNode.style.width = "50%";
					g0.addChild(t0);
					registry.byId("arrengment").addChild(g0);
					on(registry.byId("skill-" + data.id), 'change', function(newValue) {
						var oldValue = this.defaultValue?this.defaultValue:0;
						var parent = this.getParent();
						var index = registry.byId("arrengment").getIndexOfChild(parent);
						var rr;
						if(registry.byId("arrengment").getChildren().length > index + 1){
							array.forEach(registry.byId("arrengment").getChildren(), function(child, ind) {
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
								var txtid = "skill-" + data.id + "-" + j;
								var checkBox = new CheckBox({
									id:txtid+"cb"
								});
								var textbox = new TextBox({
									type:'hidden',
									id:txtid+"Id",
									name:'orderDetail'
								});
								var li = new ListItem({
									id:txtid,
									moveTo:'#',
									transition:"slide",
									moveToUrl:"js/dojo-1.9.3/app/views/multiselectlist.html",
									jsmodule:"js/dojo-1.9.3/app/src/multiselectlist.js"
								});
								on(li, "click", function(){
									var startDate = registry.byId("startDate").domNode.value;
									var endDate = registry.byId("endDate").domNode.value;
								    app.show({id: "multiselectlist",
										title: "请选择",
										type:"once",
										demourl: this.moveToUrl,
										jsmodule: this.jsmodule,
										backId: viewId,
										backTitle:"订单",
										backWidgetId: [this.id],
										select:"single",
										labelProperty:"name",
										iconCol:"del", //isUse为0时 显示绿灯小图标
										url: "userAvailable/" + startDate + "/" + endDate
										}, this);
								});
								rr.addChild(checkBox);// 3个控件
								rr.addChild(textbox);
								rr.addChild(li);
							}
							registry.byId("arrengment").addChild(rr,index+1);
						}else{
							var delNum = oldValue - newValue;
							if(delNum > 0){
								var num = rr.getChildren().length;
								var delIndex = num / 3 - delNum;// 3个控件
								if(delIndex <= 0){
									rr.destroy();
								}else{
									array.forEach(rr.getChildren(), function(child, ind) {
										if(ind >= delIndex * 3){
											child.destroy();
										}
									}); 
								}
							}
						}
						this.defaultValue = newValue;
					});
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
				
				registry.byId("orderId").set('value', args.orderId);
				request.get(args.url, {
					headers : {
						"Content-Type" : "application/json"
					},
					handleAs : "json"
				}).then(function(response) {
					if(response){
						var orderInfo = response.orderInfo;
						registry.byId("orderNo").set('value', orderInfo.orderNo);
						registry.byId("companyId").set('value', orderInfo.companyId);
						registry.byId("company").set("label", response.companyName);
						registry.byId("startDate").setDate(new Date(orderInfo.startDate));
						registry.byId("endDate").setDate(new Date(orderInfo.endDate));
						registry.byId("price").set("value", orderInfo.price);
						registry.byId("unit").set("value", orderInfo.unit);
						registry.byId("overPirce").set("value", orderInfo.overPirce);
						var nowpay = query("[name=payType]")[0];
						var aftpay = query("[name=payType]")[1];
						if(orderInfo.payType === 1){
							registry.byId(nowpay.id).set('checked', true);
							registry.byId(aftpay.id).set('checked', false);
						}else{
							registry.byId(nowpay.id).set('checked', false);
							registry.byId(aftpay.id).set('checked', true);
						}
						var nowpay1 = query("[name=overPayType]")[0];
						var aftpay1 = query("[name=overPayType]")[1];
						if(orderInfo.overPayType === 1){
							registry.byId(nowpay1.id).set('checked', true);
							registry.byId(aftpay1.id).set('checked', false);
						}else{
							registry.byId(nowpay1.id).set('checked', false);
							registry.byId(aftpay1.id).set('checked', true);
						}
						registry.byId("hotalName").set("value", orderInfo.hotalName);
						registry.byId("hotalAddress").set("value", orderInfo.hotalAddress);
						registry.byId("boyName").set("value", orderInfo.boyName);
						registry.byId("boyTel").set("value", orderInfo.boyTel);
						registry.byId("boyAddress").set("value", orderInfo.boyAddress);
						registry.byId("girlName").set("value", orderInfo.girlName);
						registry.byId("girlTel").set("value", orderInfo.girlTel);
						registry.byId("girlAddress").set("value", orderInfo.girlAddress);
						if(orderInfo.needman.length > 0){
							var type = orderInfo.needman.split(";");
							for(var i=0;i<type.length;i++){
								var tmp = type[i].split(":");
								registry.byId("skill-" + tmp[0]).set("value", tmp[1]);
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
											var txtid = "skill-" + tmp[0] + "-" + j;
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
