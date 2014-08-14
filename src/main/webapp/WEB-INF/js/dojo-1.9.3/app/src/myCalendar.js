define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/_base/event",
	"dojo/_base/connect",
	"dojo/date/locale",
	"dijit/Calendar"
],

function(
	declare,
	lang,
	arr,
	event,
	connect,
	locale,
	_Calendar){
					
	return declare("app.myCalendar",_Calendar, {
		
		getClassForDate: function(date){
			if(!this.params.spDates){
				return;
			}
			var str = locale.format(date, {formatLength: 'long', selector:'date', datePattern:'yyyy-MM-dd'});
			if(this.params.spDates[str] == "0"){
				return "green";
			}else if(this.params.spDates[str] == "1"){
				return "red";
			}
		},
		
		reRender : function(dates){
			this.params['spDates'] = dates;
			this._populateGrid();
			this._populateControls();
		},
		
		_setCurrentFocusAttr: function(date, forceFocus){
			this.inherited(arguments);
			if(this.params.monthChange){
				this.params.monthChange(date);
			}
		}
		
	});
});
