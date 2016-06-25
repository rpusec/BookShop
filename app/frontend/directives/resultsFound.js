app.directive('resultsFound', function(){
	return {
		restrict: 'E',
		template: function(element, attr){
			return '<p><b>Results found: ' + attr.value + '</b></p>';
		}
	};
});