app.directive('highlightKeywords', function(){
	var hk_consts = {
		fontSize: '130%',
		fontColor: '#0d87e9',
		elemClose: '</b>'
	}

	function setupElemOpen(fontSize, fontColor){
		return '<b style="font-size:' + fontSize + ';color:' + fontColor + ';">';
	}

	return {
		restrict: 'E',
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