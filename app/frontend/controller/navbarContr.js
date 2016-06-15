app.controller('navbarContr', function($scope){
	$scope.appTitle = 'BookShop';
	$scope.navLinks = [
		{title: 'Home', active: 'active'},
		{title: 'Books'},
		{title: 'Cart'},
		{title: 'Users'},
		{title: 'Logout'}
	];
});