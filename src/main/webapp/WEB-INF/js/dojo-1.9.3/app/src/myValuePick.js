define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/_base/event",
	"dojo/date/locale",
	"dijit/_WidgetBase",	
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!./templates/myValuePick.html",
	"dojox/mobile/TextBox",
	"dojox/mobile/Button"
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
					
	return declare("my.ValuePick", [_WidgetBase,_TemplatedMixin,_WidgetsInTemplateMixin], {
		
		templateString: template,
		
		value : 0,
		
		postCreate: function(){
			
			this.inherited(arguments);
			
			var self = this;
			
			this.minusBtn.on("click", function(){
				if(self.value > 0){
					self.value = self.value - 1;
					self.valueText.set('value', self.value);
				}
			});
			
			this.addBtn.on("click", function() {
				if(self.value < 9){
					self.value = self.value + 1;
					self.valueText.set('value', self.value);
				}
			});
			
			this.valueText.set("maxLength", 1);
			this.valueText.on("change", function(newValue) {
				self.dateChange(newValue);
			});
		},
		
		setValue : function(num){
			this.valueText.set('value', num);
			this.value = num;
		},
		
		reset : function(){
			this.valueText.set('value', 0);
			this.value = 0;
		},
		
		dateChange : function(newValue){
		}
	});
});
