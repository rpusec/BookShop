app.controller('navbarContr', function($scope, $state, $location, userService){
	$scope.appTitle = 'BookShop';
	$scope.arrNavLinks = [
		{title: 'Catalogue', uri: 'catalogue'},
		{title: 'Cart', uri: 'cart'},
		{title: 'Admin', uri: 'admin'}
	];

	$scope.currState = $state;
	$scope.$watch('currState.current.name', function(val){
		angular.forEach($scope.arrNavLinks, function(navLink){
			if(navLink.title.toLowerCase() === val)
			{
				navLink.active = 'active';
				return false;
			}
		});
	});

	$scope.highlightTitle = function(title){
		angular.forEach(this.arrNavLinks, function(link){
			if(link.title === title)
				link.active = 'active';
			else if(link.active === 'active')
				link.active = null;
		});
	}

	$scope.logout = function(){
		userService.logout(function(response){
			if(response.data.logoutSuccess)
				$location.path('/login');
			$scope.highlightTitle('');
			$.notify('Goodbye!', {
				position: 'top center',
				className: 'success'
			});
		}, function(response){

		});
	}
});