var app = angular.module("myApp", ['ui.bootstrap', 'ui.router', 'services']);

app.run(function($rootScope){
	$rootScope.navbarUrl = 'app/frontend/includes/navbar.html';
});

app.config(function($stateProvider, $urlRouterProvider, $locationProvider){
	$urlRouterProvider.otherwise('/books');
	$stateProvider
		.state('books', {url: '/books', templateUrl: 'app/frontend/includes/pages/users.html'})	
		.state('cart', {url: '/cart', templateUrl: 'app/frontend/includes/pages/cart.html'})	
		.state('admin', {url: '/admin', templateUrl: 'app/frontend/includes/pages/admin.html'})	
		.state('logout', {url: '/logout', templateUrl: 'app/frontend/includes/pages/logout.html'})	
});