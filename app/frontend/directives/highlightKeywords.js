/**
 * This directive is used for highlighting a particular keyword in a 
 * text (after a search session has been conducted). 
 * This directive is used in combination with the searchOptions 
 * directive (see explanation below). 
 * @author Roman Pusec
 * @see searchOptions directive
 */
app.directive('highlightKeywords', function(){
	
	/**
	 * Predefined variables that will be used 
	 * for stylizing the highlighted keywords. 
	 * @type {Object}
	 */
	var hk_consts = {
		fontSize: '130%',
		fontColor: '#0d87e9',
		elemClose: '</b>'
	}

	/**
	 * Sets up the opening element that will surround a keyword that has to be highlighted. 
	 * @param  {String} fontSize  The size of the font. 
	 * @param  {String} fontColor The color of the font. 
	 * @return {String}           The opening element. 
	 */
	function setupElemOpen(fontSize, fontColor){
		return '<b style="font-size:' + fontSize + ';color:' + fontColor + ';">';
	}

	return {
		restrict: 'E',

		/**
		 * This function is executed whenever the <highlight-keywords> directive template 
		 * has been created, and this is where the logic behind highlighting a specific 
		 * keyword is writted. 
		 *
		 * It is cruical that the scope references the <search-options> directive, since 
		 * that directive references the 'searchOptions.searchBy' property which tells 
		 * this directive which keyword to highlight. 
		 * 
		 * The 'searchOptions.searchMode' has to be set to true (to indicate that the
		 * search operation was held). 
		 * 
		 * Lastly, the 'searchOptions.filter' has to be defined to tell the directive 
		 * which aspect of the entity should be examined (e.g. a filter for a book can be 
		 * the title, description, etc). 
		 * 
		 * @requires searchOptions directive
		 * @see searchOptions
		 */
		link: function(scope, elem, attr){
			scope.$watch(attr.watch, function(value){
				if(	typeof scope.searchOptions === 'undefined' || 
					scope.searchOptions.filter !== attr.filter || 
					!scope.searchOptions.searchMode)
					return;

				var	filteredValue = value
				,	elemOpen = setupElemOpen(hk_consts.fontSize, hk_consts.fontColor)
				,	searchBy = scope.searchOptions.searchBy
				,	indOfStart = 0
				,	pos = 0;

				while((pos = filteredValue.toLowerCase().indexOf(searchBy, indOfStart)) !== -1){
					filteredValue = filteredValue.substr(0, pos) + 
					elemOpen + 
					filteredValue.substr(pos, searchBy.length) + 
					hk_consts.elemClose + 
					filteredValue.substr(pos+searchBy.length);
					indOfStart = pos+searchBy.length + elemOpen.length;
				}

				elem.context.innerHTML = filteredValue;
			});
		}
	};
});