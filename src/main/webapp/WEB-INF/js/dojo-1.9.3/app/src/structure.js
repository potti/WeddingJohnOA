define(["dojo/_base/lang"],
		function(lang){
	lang.getObject("app.src.structure", true);
	
	var THRESHOLD_WIDTH = 600;

	app.src.structure = {
		layout: {
			threshold: THRESHOLD_WIDTH, // threshold for layout change
			leftPane: {
				hidden: (window.innerWidth < THRESHOLD_WIDTH) ? true : false,
						currentView: null
			},
			rightPane: {
				hidden: false,
				currentView: null
			},
			getViewHolder: function(id) {
				if (id === "navigation")
					return (window.innerWidth < THRESHOLD_WIDTH) ? "rightPane" : "leftPane";
				else
					return "rightPane";
			},
			setCurrentView: function(id) {
				var holder = this.getViewHolder(id);
				this[holder].currentView = id;
			},
			// last selected demo view
			currentDemo: {
				id: "welcome",
				title: "Wedding John 日常管理系统"
			}
		},
		demos: [{
			id: "controls",
			label: "管理",
			power : 10,
			iconBase: "images/navigation_list_all_29.png",
			views: [{
				id: "createOrder",
				iconPos: "29,0,29,29",
				title: "创建订单",
				demourl: "js/dojo-1.9.3/app/views/createOrder.html",
				jsmodule: "js/dojo-1.9.3/app/src/createOrder.js"
			},{
				id: "orderSearchCondition",
				iconPos: "203,0,29,29",
				title: "查找订单",
				demourl: "js/dojo-1.9.3/app/views/orderSearchCondition.html",
				jsmodule: "js/dojo-1.9.3/app/src/orderSearchCondition.js"
			}]
		}, {
			id: "userfunction",
			label: "个人",
			power : 1,
			iconBase: "images/navigation_list_all_29.png",
			views: [{
				id: "signin",
				iconPos: "0,0,29,29",
				title: "两周签到",
				power : 1,
				demourl: "js/dojo-1.9.3/app/views/signin.html",
				jsmodule: "js/dojo-1.9.3/app/src/signin.js"
			}, {
				id: "userschedule",
				iconPos: "87,0,29,29",
				title: "查看日程",
				power : 1,
				demourl: "js/dojo-1.9.3/app/views/userschedule.html",
				jsmodule: "js/dojo-1.9.3/app/src/userschedule.js"
			}, {
				id: "myOrderList",
				iconPos: "435,0,29,29",
				title: "我的未拍订单",
				power : 1,
				demourl: "js/dojo-1.9.3/app/views/myOrderList.html",
				jsmodule: "js/dojo-1.9.3/app/src/myOrderList.js"
			}, {
				id: "changePwd",
				iconPos: "261,0,29,29",
				title: "修改密码",
				power : 1,
				demourl: "js/dojo-1.9.3/app/views/changePwd.html",
				jsmodule: "js/dojo-1.9.3/app/src/changePwd.js"
			}]
		}],
		/* Below are internal views. */
		_views: [{
			id: 'welcome',
			title: 'Wedding John 日常管理系统'
		}, {
			id: 'navigation',
			title: '欢迎,  ',
			type: 'navigation',
			back: ''
		}],
		/* data model for tracking view loading */
		load: {
			loaded: 0,
			target: 0 //target number of views that should be loaded
		},
		// navigation list
		navRecords: [],
		// 选择后删除的ids
		destoryIds : []
	};
	return app.src.structure;
});
