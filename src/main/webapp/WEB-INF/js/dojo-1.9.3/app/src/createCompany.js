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
        "dojo/store/Memory",
        "dojox/mobile/ComboBox",
		"dojox/mobile/TextArea",// not used in this module, but dependency of the demo template HTML
		"dojox/mobile/TextBox",
		"dojox/mobile/RadioButton",
		"app/src/myDatePick",
		"dojox/mobile/TextArea",
		"dojox/mobile/FormLayout",
		"dijit/form/Form"
		], function(dom,domConstruct,on,array,registry,request,query,locale,connect,app,structure,domForm,JSON,
				Memory,ComboBox) {
	var internalNavRecords = [];
	return {
		init: function(args){
			var skills = [];
			var viewId = "createCompany";
			var self = this;
			on(registry.byId("ccresetBtn"), "click", function(){
				dom.byId("createCompanyForm").reset();
			});
			
			var typeStore = new Memory({ 
				idProperty: "id", 
				data: [
				       { name: "类别1",id:1 },
				       { name: "类别2",id:2 }
				]
			});
			
			var typeComboBox = new ComboBox({
		        id: "company_type",
		        store: typeStore,
		        searchAttr: "name",
		        onChange : app.validateCombo,
		    }, "company_type").startup();
			
			var levelStore = new Memory({ 
				idProperty: "id", 
				data: [
				       { name: "一般",id:1 },
				       { name: "中等",id:2 },
				       { name: "重要",id:3 }
				]
			});
			
			var levelComboBox = new ComboBox({
		        id: "company_level",
		        store: levelStore,
		        onChange : app.validateCombo,
		        searchAttr: "name"
		    }, "company_level").startup();
			
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

			on(registry.byId("ccsubmitBtn"), "click", function() {
						var company = domForm.toObject("createCompanyForm");
						
						if(!app.formValidate(company,"company_")){
							return;
						}
						
						if(registry.byId("company_type").get("item")){
							company['type'] = typeStore.getIdentity(registry.byId("company_type").get("item"));
						}else{
							alert("请正确填写信息...");
							registry.byId("company_type").focus();
							return;
						}
						if(registry.byId("company_level").get("item")){
							company['level'] = levelStore.getIdentity(registry.byId("company_level").get("item"));
						}else{
							alert("请正确填写信息...");
							registry.byId("company_level").focus();
							return;
						}
						if(company["id"]){
							//update
							request.put("company", {
								data : JSON.stringify(company),
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
							request.post("company", {
								data : JSON.stringify(company),
								headers : {
									"Content-Type" : "application/json"
								},
								handleAs : "json"
							}).then(function(response) {
								if(response != -1){
									registry.byId("companyId").set('value', response);
									registry.byId("ccdelBtn").set('disabled', false);
									alert("创建成功");
								}else{
									alert("创建失败，请重试或联系管理员");
								}
							});
						}
					});
			
			on(registry.byId("ccdelBtn"), "click", function(){
				if(registry.byId("companyId").get('value').length <= 0){
					return;
				}
				request.del("company/" + registry.byId("companyId").get('value'), {
					headers : {
						"Content-Type" : "application/json"
					},
					handleAs : "json"
				}).then(function(response) {
					if(response == 1){
						app.back();
					}else{
						alert("删除失败，请重试或联系管理员");
					}
				});
			});
			
			// ************************************ update时的界面  **********************************************
			if(args && args.itemId){
				var navRecords = structure.navRecords;
				navRecords.push({
					delTo : true,
					from: args.backId,
					fromTitle: args.backTitle,
					to: args.id,
					toTitle: args.title,
					navTitle: args.backTitle
				});
				
				registry.byId("companyId").set('value', args.itemId);
				registry.byId("ccdelBtn").set('disabled', false);
				request.get(args.url, {
					headers : {
						"Content-Type" : "application/json"
					},
					handleAs : "json"
				}).then(function(response) {
					if(response){
						registry.byId("company_companyName").set('value', response.companyName);
						registry.byId("company_no").set('value', response.no);
						registry.byId("company_address").set("value", response.address);
						registry.byId("company_contactName").set("value", response.contactName);
						registry.byId("company_contactTel").set("value", response.contactTel);
						registry.byId("company_mail").set("value", response.mail);
						registry.byId("company_type").set("item", registry.byId("company_type").get("store").get(response.type));
						registry.byId("company_level").set("item", registry.byId("company_level").get("store").get(response.level));
						registry.byId("company_price").set("value", response.price);
						registry.byId("company_unit").set("value", response.unit);
						registry.byId("company_overtimePrice").set("value", response.overtimePrice);
						registry.byId("company_remark").set("value", response.remark);
					}
				});
			}
			// ************************************ update时的界面  **********************************************
		}
	};
});
