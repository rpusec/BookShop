var app = angular.module("myApp", ['ui.bootstrap', 'services']);

app.run(function($rootScope){
	$rootScope.navbarUrl = 'app/frontend/includes/navbar.html';
});