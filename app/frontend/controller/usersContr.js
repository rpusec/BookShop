var app = angular.module("myApp", ['ui.bootstrap', 'services']);

app.controller("usersContr", function($scope, $http, userCrud){
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
	$scope.pagination = {
		totalItems: null,
		currentPage: 1,
		itemsPerPage: 5,
		onPageChange: function(){
			displayUsers();
		}
	};

	displayUsers();

	$scope.setEditingUserLabel = function(userID, fname, lname){
		$scope.editUserData.userID = userID;
		$scope.editingUser.fname = fname;
		$scope.editingUser.lname = lname;
	}

	function displayUsers(){
		userCrud.displayUsers(
			$scope.pagination.currentPage, 
			$scope.pagination.itemsPerPage,
			function(response){
				$scope.users = response.data.users;
				$scope.pagination.totalItems = response.data.userCount;
			},
			function(response){
				console.log(response);
			}
		);
	}

	$scope.editUser = function(){
		userCrud.editUser(
			this.editUserData,
			function(response){
				displayUsers();
			}, function(response){
				console.log(response);
			}
		);
	}

	$scope.deleteUser = function(){
		userCrud.deleteUser(
			this.userToDeleteID,
			function(response){
				displayUsers();
			}, function(response){
				console.log(response);
			}
		);
	}
});