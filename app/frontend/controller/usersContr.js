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

	$scope.deleteUser = function(){
		$http({
			method: 'GET',
			url: 'app/backend/view/userview.php',
			params: {funct: 'delete-user', userID: this.userToDeleteID}
		}).then(function success(response){
			displayUsers();
		}, function error(response){
			console.log(response);
		});
	}

	$scope.editUser = function(){
		this.editUserData.funct = 'edit-user';
		$http({
			method: 'GET',
			url: 'app/backend/view/userview.php',
			params: this.editUserData
		}).then(function success(response){
			displayUsers();
		}, function error(response){
			console.log(response);
		});
	}

	function displayUsers(){
		$http({
			method: 'GET',
			url: 'app/backend/view/userview.php?',
			params: {
				funct: 'get-users', 
				currentPage: $scope.pagination.currentPage,
				perPage: $scope.pagination.itemsPerPage
			}
		}).then(function success(response){
			$scope.users = response.data.users;
			$scope.pagination.totalItems = response.data.userCount;
		}, function error(response){
			console.log(response);
		});
	}
});