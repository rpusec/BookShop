app.directive('searchOptions', function(){
	return {
		restrict: 'E',
		link: function(scope, elem, attr){
			scope.searchOptions = {};
			scope.searchOptions.searchBy = "";
			scope.searchOptions.searchMode = false;
			var	filtersInitial = attr.filters.split(';')
			,	filters = [];

			angular.forEach(filtersInitial, function(filter){
				var filterData = filter.split('=');
				filters.push({id: filterData[0], name: filterData[1]});
			});

			scope.searchOptions.filters = filters;
			scope.searchOptions.filter = filters[0].id;
			
			scope.searchOptions.executeSearch = function(defaultSearch){
				if(typeof defaultSearch !== 'boolean')
					defaultSearch = false;

				if(!defaultSearch)
				{
					scope.searchOptions.searchMode = true;
					scope.searchOptions.chosenSeachBy = scope.searchOptions.searchBy;
					scope.searchOptions.chosenFilter = scope.searchOptions.filter;
				}
				
				scope[attr.searchfunct]();
			}

			scope.searchOptions.exitSearchMode = function(){
				scope.searchOptions.searchMode = false;
				scope.searchOptions.searchBy = "";
				scope.searchOptions.executeSearch(true);				
			}
		},
		templateUrl: 'app/frontend/includes/dirtemps/searchOptions.html'
	};
});