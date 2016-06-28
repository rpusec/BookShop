/**
 * App instance shared by all controllers. 
 * @author Roman Pusec
 */
var app = angular.module("myApp", ['ui.bootstrap', 'ui.router', 'services']);

/**
 * Storing variables shared by all pages. 
 * @author Roman Pusec
 * @see ovserverService
 */
app.run(function($rootScope){
	$rootScope.navbarUrl = 'app/frontend/includes/navbar.html';
	$rootScope.footerUrl = 'app/frontend/includes/footer.html';
});

/**
 * Configuring all various states of the application. 
 * @author Roman Pusec
 * @see tutorial for Angular UI Router. 
 */
app.config(function($stateProvider, $urlRouterProvider, $locationProvider){
	$urlRouterProvider.otherwise('/catalogue');
	$stateProvider
		//other
		.state('login', {url: '/login', templateUrl: 'app/frontend/includes/pages/login.html'})	
		.state('catalogue', {url: '/catalogue', templateUrl: 'app/frontend/includes/pages/catalogue.html'})	
		.state('cart', {url: '/cart', templateUrl: 'app/frontend/includes/pages/cart.html'})		
		.state('logout', {url: '/logout', templateUrl: 'app/frontend/includes/pages/logout.html'})
		.state('accsettings', {url: '/accsettings', templateUrl: 'app/frontend/includes/pages/accsettings.html'})
		//admin
		.state('admin', {url: '/admin', templateUrl: 'app/frontend/includes/pages/admin.html'})
		.state('users', {url: '/users', templateUrl: 'app/frontend/includes/pages/users.html', parent: 'admin'})
		.state('books', {url: '/books', templateUrl: 'app/frontend/includes/pages/books.html', parent: 'admin'});
});