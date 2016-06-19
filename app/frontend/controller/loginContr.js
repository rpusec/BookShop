app.controller('loginContr', function($scope, $location, authService, observerService){
	if(authService.isAuthenticated())
		$location.path('/catalogue');

	$scope.login = function(){
		authService.login(
			this.username, 
			this.password,
			function(){
				$scope.username = '';
				$scope.password = '';
				observerService.notifyAll('auth');
			}, function(response){
				console.log(response);
			}
		);
	}
});