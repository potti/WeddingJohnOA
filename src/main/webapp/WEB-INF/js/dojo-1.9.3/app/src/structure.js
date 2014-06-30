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
				title: "Welcome"
			}
		},
		demos: [{
			id: "controls",
			label: "Controls",
			iconBase: "images/navigation_list_all_29.png",
			views: [{
				id: "schedule1",
				iconPos: "0,0,29,29",
				title: "日程1",
				demourl: "js/dojo-1.9.3/app/views/dateSwitches1.html"
			}, {
				id: "schedule2",
				iconPos: "29,0,29,29",
				title: "日程2",
				demourl: "js/dojo-1.9.3/app/views/dateSwitches2.html"
			}, {
				id: "createOrder",
				iconPos: "29,0,29,29",
				title: "创建订单",
				demourl: "js/dojo-1.9.3/app/views/createOrder.html",
				jsmodule: "js/dojo-1.9.3/app/src/createOrder.js"
			}]
		}, {
			id: "effects",
			label: "Effects",
			iconBase: "images/navigation_list_all_29.png",
			views: [{
				id: "list",
				iconPos: "290,0,29,29",
				title: "list",
				demourl: "js/dojo-1.9.3/app/views/list.html",
				jsmodule: "js/dojo-1.9.3/app/src/list.js"
			}]
		}, {
			id: "dataList",
			label: "Data",
			iconBase: "images/navigation_list_all_29.png",
			views: [{
				id: "jsonp",
				iconPos: "319,0,29,29",
				title: "JSON P",
				demourl: "views/jsonp.html",
				jsmodule: "demos/mobileGallery/src/jsonp",
				jsSrc: "doc/src/jsonp.js.txt"
			}]
		}],
		/* Below are internal views. */
		_views: [{
			id: 'source',
			title: 'Source',
			type: 'source'
		}, {
			id: 'welcome',
			title: 'Welcome'
		}, {
			id: 'navigation',
			title: 'Showcase',
			type: 'navigation',
			back: ''
		}],
		/* data model for tracking view loading */
		load: {
			loaded: 0,
			target: 0 //target number of views that should be loaded
		},
		// navigation list
		navRecords: []
	};
	return app.src.structure;
});
