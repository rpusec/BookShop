app.controller('adminContr', function($scope, $location, authService){
	if(!authService.isAuthenticated())
	{
		$location.path('/login');
		return;
	}

	$scope.navLinks = [
		{title: 'Users', uri: 'users'},
		{title: 'Books', uri: 'books'}
	];
});