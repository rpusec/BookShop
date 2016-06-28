/**
 * Handles logic for navigation bar-related processes. 
 * @author Roman Pusec
 */
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

	/**
	 * Highlights a specific navigation link.  
	 * @param  {[type]} title The text or title of the navigation link. 
	 */
	$scope.highlightTitle = function(title){
		angular.forEach(this.arrNavLinks, function(link){
			if(link.title === title)
				link.active = 'active';
			else if(link.active === 'active')
				link.active = null;
		});
	}

	/**
	 * Logs the user out. 
	 * @see authService.logout
	 */
	$scope.logout = function(){
		if(!authService.isAuthenticated())
			return;
		
		authService.logout();
		this.highlightTitle('');
	}

	/**
	 * Opens the account settings page. 
	 */
	$scope.openAccountSettings = function(){
		if(!authService.isAuthenticated())
			return;

		$location.path('/accsettings');
		this.highlightTitle('');
	}

	/**
	 * Executed when the user updates their account 
	 * settings (e.g. their first and last name). 
	 * @see accSettingsContr controller for explanation. 
	 */
	$scope.$on('updateNavbarData', function(e, data){
		$scope.fname = data.fname;
		$scope.lname = data.lname;
		$location.path('/catalogue');
	});

	/**
	 * This function is executed whenever the user logs in or 
	 * out of the application. If the user is logged out, then
	 * the navigation links are hidden, otherwise all of them 
	 * are displayed. In addition, it checks whether the user 
	 * is an administrator, and by that it also sets the admin
	 * navigation link as visible. 
	 */
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