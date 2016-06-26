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

		authService.updateSession(function(response){
			if(!response.data.authenticated)
			{
				forceLogout(response.data.message);
				return;
			}

			$scope.data.userID = authService.getSession().userID;
			userService.editUser($scope.data, function(response){
				if(response.data.authenticated)
				{
					if(!response.data.hasErrors)
					{
						$.notify('Settings successfully updated. ', {className: 'success', position: 'top center'});
						authService.updateSession(function(response){
							if(response.data.authenticated)
								$rootScope.$broadcast('updateNavbarData', response.data.user);
							else
								forceLogout(response.data.message);
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
					forceLogout(response.data.message);
			});
		});
	}

	function forceLogout(msg){
		authService.logout({
			message: msg,
			messageType: 'error'
		});
	}
});