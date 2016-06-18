app.controller('loginContr', function($scope, $location, userService){
	$scope.login = function(){
		userService.login(
			this.username, 
			this.password,
			function(response){
				$scope.username = '';
				$scope.password = '';
				if(response.data.loginSuccess)
				{
					$.notify('Access granted! ', {
						className: 'success',
						position: 'top center'
					});
					$location.path('/catalouge');
				}
				else
					$('#loginForm').notify('Wrong username or password. ', {
						position: 'top center',
						className: 'error',
						autoHideDelay: 2000
					});
			},
			function(response){
				console.log(response);
			}
		);
	}
});