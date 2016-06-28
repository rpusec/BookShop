/**
 * Handles simple user authenticaiton. 
 * @author Roman Pusec
 */
app.controller('loginContr', function($rootScope, $scope, $location, authService){
	if(authService.isAuthenticated())
	{
		$location.path('/catalogue');
		return;
	}

	/**
	 * Authenticates the user to the application. 
	 */
	$scope.login = function(){
		authService.login(
			this.username, 
			this.password,
			function(response){
				$scope.username = '';
				$scope.password = '';
				$rootScope.$broadcast('updateNavbarState');
			}
		);
	}
});