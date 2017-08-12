define(['knockout'], function(ko){

	function AppModel(){

		var self = this;

	};

	ko.utils.extend(AppModel.prototype, {
		Initialize: function(){
			//app startup code			
		}
	});
	
	return AppModel;
});