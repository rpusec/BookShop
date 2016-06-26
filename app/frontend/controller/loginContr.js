app.controller('loginContr', function($scope, $location, authService, observerService){
	if(authService.isAuthenticated())
	{
		$location.path('/catalogue');
		return;
	}

	$scope.login = function(){
		authService.login(
			this.username, 
			this.password,
			function(response){
				$scope.username = '';
				$scope.password = '';
				observerService.notifyAll('auth');
				console.log(response);
			}
		);
	}
});