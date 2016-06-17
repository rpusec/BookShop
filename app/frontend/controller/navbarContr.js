app.controller('navbarContr', function($scope){
	$scope.appTitle = 'BookShop';
	$scope.arrNavLeft = [
		{title: 'Books', uri: 'books', active: 'active'},
		{title: 'Cart', uri: 'cart'},
		{title: 'Admin', uri: 'admin'}
	];
	$scope.arrNavRight = [
		{title: 'Logout', uri: 'logout'}
	];

	$scope.highlightTitle = function(title, isNavLeft){
		angular.forEach(isNavLeft ? this.arrNavLeft : this.arrNavRight, function(link){
			if(link.title === title)
				link.active = 'active';
			else if(link.active === 'active')
				link.active = null;
		});

		angular.forEach(!isNavLeft ? this.arrNavLeft : this.arrNavRight, function(link){
			if(link.active === 'active')
			{
				link.active = null;
				return false;
			}
		});
	}
});