app.controller('accSettingsContr', function($scope, $rootScope, $location, authService, userService){
	if(!authService.isAuthenticated())
	{
		$location.path('/login');
		return;
	}

	$scope.data = {};

	$scope.saveSettings = function(){
		if(!authService.isAuthenticated())
		{
			$location.path('/login');
			return;
		}

		this.data.userID = authService.getSession().userID;
		userService.editUser(this.data, function(response){
			if(response.data.authenticated)
			{
				if(!response.data.hasErrors)
				{
					$.notify('Settings successfully updated. ', {className: 'success', position: 'top center'});
					authService.updateSession(function(response){
						if(response.data.authenticated)
							$rootScope.$broadcast('updateNavbarData', response.data.user);
						else
							authService.logout({
								message: response.data.message,
								messageType: 'error'
							});
					});
				}
				else
				{
					angular.forEach(response.data.errors, function(errorMessage, errorKey){
						$scope.data[errorKey + '_error'] = true;
						$.notify(errorMessage, {className: 'error', position: 'top center'});
					});
				}
			}
			else
				authService.logout({
					message: response.data.message,
					messageType: 'error'
				});
		});
	}
});