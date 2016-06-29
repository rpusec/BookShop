/**
 * The base page for the administration panel. Serves no purpose other than providing links
 * to the 'Users' and 'Books' secrion and to redirect the user if the user is not an admin 
 * or is not authenticated.  
 * @author Roman Pusec
 */
app.controller('adminContr', function($scope, $location, $window, authService){
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