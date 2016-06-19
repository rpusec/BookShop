app.controller('navbarContr', function($scope, $state, $location, authService, observerService){
	$scope.appTitle = 'BookShop';
	var arrNavLinks = [
		{title: 'Catalogue', uri: 'catalogue'},
		{title: 'Cart', uri: 'cart'},
		{title: 'Admin', uri: 'admin'}
	];
	$scope.arrNavLinks = null;
	$scope.logoutShown = false;

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
		if(authService.isAuthenticated())
		{
			authService.logout(function(){
				authService.destroySession();
				observerService.notifyAll('auth');
			});
			this.highlightTitle('');
		}
	}

	observerService.subscribe('auth', function(){
		if(authService.isAuthenticated())
		{
			$scope.arrNavLinks = arrNavLinks;
			$scope.logoutShown = true;
		}
		else
		{
			$scope.arrNavLinks = null;
			$scope.logoutShown = false;
		}
	});

	observerService.notifyAll('auth');
});