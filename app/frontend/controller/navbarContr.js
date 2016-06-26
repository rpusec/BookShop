app.controller('navbarContr', function($scope, $state, $location, authService, observerService){
	$scope.appTitle = 'BookShop';

	var arrNavLinks = {
		catalogue: {title: 'Catalogue', uri: 'catalogue'},
		cart: {title: 'Cart', uri: 'cart'},
		admin: {title: 'Admin', uri: 'admin'}
	};

	$scope.arrNavLinks = null;
	$scope.userBarShown = false;

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
		if(!authService.isAuthenticated())
			return;
		
		authService.logout();
		this.highlightTitle('');
	}

	$scope.openAccountSettings = function(){
		if(!authService.isAuthenticated())
			return;

		$location.path('/accsettings');
		this.highlightTitle('');
	}

	$scope.$on('updateNavbarData', function(e, data){
		$scope.fname = data.fname;
		$scope.lname = data.lname;
		$location.path('/catalogue');
	});

	observerService.subscribe('auth', function(){
		if(authService.isAuthenticated())
		{
			$scope.arrNavLinks = arrNavLinks;
			$scope.userBarShown = true;
			
			var session = authService.getSession();
			$scope.fname = session.fname;
			$scope.lname = session.lname;

			if(!authService.isAdmin())
				arrNavLinks['admin'].hide = true;
		}
		else
		{
			$scope.highlightTitle('');
			$scope.arrNavLinks = null;
			$scope.userBarShown = false;
			angular.forEach(arrNavLinks, function(link){
				link.hide = false;
			});
		}
	});

	observerService.notifyAll('auth');
});