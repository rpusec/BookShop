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
	$scope.editingUser = {
		fname: '',
		lname: ''
	};
	$scope.userToDeleteID = -1;
	$scope.editUserData = {};

	displayUsers();

	$scope.setEditingUserLabel = function(userID, fname, lname){
		$scope.editUserData.userID = userID;
		$scope.editingUser.fname = fname;
		$scope.editingUser.lname = lname;
	}

	$scope.deleteUser = function(){
		$http({
			method: 'GET',
			url: 'app/backend/view/userview.php?funct=delete-user&userID=' + this.userToDeleteID
		}).then(function success(response){
			displayUsers();
		}, function error(response){
			console.log(response);
		});
	}

	$scope.editUser = function(){
		console.log('works');
		this.editUserData.funct = 'edit-user';
		$http({
			method: 'GET',
			url: 'app/backend/view/userview.php',
			params: this.editUserData
		}).then(function success(response){
			console.log(response);
			displayUsers();
		}, function error(response){
			console.log(response);
		});
	}

	function displayUsers(){
		$http({
			method: 'GET',
			url: 'app/backend/view/userview.php?funct=get-users'
		}).then(function success(response){
			$scope.users = response.data.users;
		}, function error(response){
			console.log(response);
		});
	}
});