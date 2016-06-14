var app = angular.module("myApp", ['ui.bootstrap']);
app.controller("usersContr", function($scope, $http){
	$scope.users = null;
	$scope.popover = {
		deleteUserTemplateUrl: 'deleteUserTemplateUrl.html',
		deleteUserPlacement: 'right'
	};
	$scope.modals = {
		editUserModal: "app/frontend/includes/modals/editUserModal.html"
	};

	$http({
		method: 'GET',
		url: 'app/backend/view/userview.php?funct=get-users'
	}).then(function success(response){
		$scope.users = response.data.users;
	}, function error(response){
		console.log(response);
	});
});