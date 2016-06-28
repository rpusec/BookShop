/**
 * Displays the number of results in a <b> and <p> tag. 
 * @author Roman Pusec 
 */
app.directive('resultsFound', function(){
	return {
		restrict: 'E',
		template: function(element, attr){
			return '<p><b>Results found: ' + attr.value + '</b></p>';
		}
	};
});