/**
 * Handles the account settings of the authenticated user. 
 * @author Roman Pusec
 */
app.controller('accSettingsContr', function($scope, $rootScope, $location, authService, userService){
	if(!authService.isAuthenticated())
	{
		$location.path('/login');
		return;
	}

	$scope.data = {};

	/**
	 * Saves the updated user settings. 
	 * The session is first updated to avoid any possible cross site scripting attacks, since the data
	 * is stored in localStorage and can be accessed and edited in the browser. 
	 * Finally, the navigation bar is updated with user's updated settings. 
	 * @see authService.updateSession
	 */
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

	/**
	 * Logs the authenticated user out of the application. 
	 * @param  {String} msg The message to display. 
	 */
	function forceLogout(msg){
		authService.logout({
			message: msg,
			messageType: 'error'
		});
	}
});