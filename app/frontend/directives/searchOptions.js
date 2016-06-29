/**
 * This single directive is composed of two input fields: a search 
 * input field for writing a keyword to search, and a combobox which 
 * offers specified filtering options. 
 *
 * An example of a filter for a book entity would be for instance: author,
 * description, and title. So these could be the filtering options that users
 * can filter their search with. 
 *
 * This directive is strictly used as an element, and offers two attributes:
 *
 *  * filters - Specifies the filters that are available for the entity in question.
 *              Each filter is referenced as a key and value pair, and the keys and 
 *              values are separated by the equals delimiter (e.g. 'fname=First name', 
 *              'lname=Last name', etc.). 
 *              
 *              In our example, the keys reference a column 
 *              name in the database, and the values is what the user sees in the 
 *              mentioned combobox. 
 *
 *              Each filter is separated by a colon, for instance an example of a value for
 *              the filters attribute would be as following: 
 *              'title=Title;author=Author;description=Description;price=Price'
 *  
 *  * searchfunct - References the function from the parent controller that is used for searching
 *                  the entities that contain the specified keyword. 
 */
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
			
			/**
			 * Executes the search based upon the chosen 
			 * filter and the written keyword. 
			 *
			 * The default search parameter specifies that the
			 * search should *not* include the chosen filter and 
			 * searchBy options. This option is set to true if we 
			 * want to exit search mode and display the convetional
			 * results. 
			 * 
			 * @param  {Boolean} defaultSearch True to execute default search, false otherwise. 
			 */
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

			/**
			 * Exits the search mode, deletes the searchBy value, 
			 * and provides all results that aren't bound to any 
			 * keyword searches. 
			 */
			scope.searchOptions.exitSearchMode = function(){
				scope.searchOptions.searchMode = false;
				scope.searchOptions.searchBy = "";
				scope.searchOptions.executeSearch(true);				
			}
		},
		templateUrl: 'app/frontend/includes/dirtemps/searchOptions.html'
	};
});