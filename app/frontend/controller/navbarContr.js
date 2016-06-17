app.controller('navbarContr', function($scope, $state){
	$scope.appTitle = 'BookShop';
	$scope.arrNavLeft = [
		{title: 'Catalogue', uri: 'catalogue'},
		{title: 'Cart', uri: 'cart'},
		{title: 'Admin', uri: 'admin'}
	];
	$scope.arrNavRight = [
		{title: 'Logout', uri: 'logout'}
	];
	$scope.currState = $state;
	$scope.$watch('currState.current.name', function(val){
		angular.forEach($scope.arrNavLeft, function(navLink){
			if(navLink.title.toLowerCase() === val)
			{
				navLink.active = 'active';
				return false;
			}
		});
	});

	$scope.highlightTitle = function(title){
		angular.forEach(this.arrNavLeft, function(link){
			if(link.title === title)
				link.active = 'active';
			else if(link.active === 'active')
				link.active = null;
		});
	}
});