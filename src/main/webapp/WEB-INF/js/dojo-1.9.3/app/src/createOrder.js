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
		"dojox/mobile/TextArea",// not used in this module, but dependency of the demo template HTML
		"dojox/mobile/CheckBox",
		"dojox/mobile/RadioButton",
		"dojox/mobile/Opener",
		"dojox/mobile/Heading",
		"dojox/mobile/SpinWheelDatePicker",
		"dojox/mobile/FixedSplitter",
		"app/src/myDatePick",
		"dojox/mobile/FormLayout"
		], function(dom,on,array,registry,request,query,locale,connect,app,structure,domForm,JSON,Pane,TextBox,GridLayout,
				RoundRectList,ListItem) {
	var internalNavRecords = [];
	return {
		init: function(){
			var viewId = "createOrder";
			var self = this;
			on(registry.byId("resetBtn"), "click", function(){
				dom.byId("createOrderForm").reset();
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

			on(registry.byId("submitBtn"), "click", function() {
						var jsonData = domForm.toObject("createOrderForm");
						jsonData['startDate'] = registry.byId("startDate").domNode.value;
						jsonData['endDate'] = registry.byId("endDate").domNode.value;
						request.post("order", {
							data : JSON.stringify(jsonData),
							headers : {
								"Content-Type" : "application/json"
							},
							handleAs : "json"
						}).then(function(response) {
						});
					});
			
			request.get("skill", {
				headers : {
					"Content-Type" : "application/json"
				},
				handleAs : "json"
			}).then(function(response) {
				array.forEach(response,function(data){
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
								var textbox = new TextBox({
									type:'hidden',
									id:txtid+"Id"
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
										url: "userAvailable/" + startDate + "/" + endDate
										}, this);
								});
								rr.addChild(textbox);
								rr.addChild(li);
							}
							registry.byId("arrengment").addChild(rr,index+1);
						}else{
							var delNum = oldValue - newValue;
							if(delNum > 0){
								var num = rr.getChildren().length;
								var delIndex = num - 1 - delNum;
								if(delIndex < 0){
									rr.destroy();
								}else{
									array.forEach(rr.getChildren(), function(child, ind) {
										if(ind > delIndex){
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
		}
	};
});
