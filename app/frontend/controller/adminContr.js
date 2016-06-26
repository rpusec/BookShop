app.controller('adminContr', function($scope, $location, authService){
	if(!authService.isAuthenticated())
	{
		$location.path('/login');
		return;
	}

	if(!authService.isAdmin())
	{
		authService.logout({
			message: 'You do not have sufficient privilege. ',
			messageType: 'error'
		});
		return;
	}

	$scope.navLinks = [
		{title: 'Users', uri: 'users'},
		{title: 'Books', uri: 'books'}
	];
});