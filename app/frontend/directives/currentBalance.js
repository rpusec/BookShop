/**
 * Displays the current balance in a h3 element. 
 * @author Roman Pusec
 */
app.directive('currentBalance', function(){
	return {
		restrict: 'E',
		template: function(element, attr){
			return '<h3>Current balance: $' + attr.value + ' </h3>';
		}
	};
});