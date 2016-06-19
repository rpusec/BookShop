app.controller('adminContr', function($scope, $location, authService){
	if(!authService.isAuthenticated())
		$location.path('/login');

	$scope.navLinks = [
		{title: 'Users', uri: 'users'},
		{title: 'Books', uri: 'books'}
	];
});