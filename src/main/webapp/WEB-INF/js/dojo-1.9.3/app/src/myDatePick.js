define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/_base/event",
	"dojo/date/locale",
	"dijit/_WidgetBase",	
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!./templates/myDatePick.html",
	"dojox/mobile/Opener",
	"dojox/mobile/Heading",
	"dojox/mobile/SpinWheelDatePicker",
	"dojox/mobile/TextBox",
	"dojox/mobile/ToolBarButton"
],

function(
	declare,
	lang,
	arr,
	event,
	locale,
	_WidgetBase,
	_TemplatedMixin,
	_WidgetsInTemplateMixin,
	template){
					
	return declare("my.DatePick", [_WidgetBase,_TemplatedMixin,_WidgetsInTemplateMixin], {
		
		templateString: template,
		
		postCreate: function(){
			
			this.inherited(arguments);
			
			var self = this;
			
			var today = locale.format(new Date(), {datePattern: "yyyy-MM-dd", selector: "date"});
			this.datePickerText.set('value', today);
			this.domNode.value = today;
			
			this.datePickerText.on("click", function(){
				self.datePicker.show(this, ['above-centered','below-centered','after','before']);
			});
			
			this.datePicker.on("hide", function(node, v){
				if(v === true){ // Done clicked
					self.datePickerText.set('value', self.spinWheelDatePicker.get("value"));
					self.domNode.value = self.spinWheelDatePicker.get("value");
				}
			});
			
			this.datePicker.on("show", function(node){
				var v = self.datePickerText.get("value").split(/-/);
				if(v.length == 3){
					self.spinWheelDatePicker.set("values", v);
				}
			});
			
			this.doneBtn.on("click", function() {
				self.datePicker.hide(true);
			});
			
			this.cancelBtn.on("click", function() {
				self.datePicker.hide(false);
			});
			
		}
	});
});
