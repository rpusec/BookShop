app.controller("userContr", function($scope, userService){
	$scope.users = null;
	$scope.metadata = ['First name', 'Last name', 'Username', 'Password', 'Amount', 'Edit', 'Delete'];
	$scope.popover = {
		deleteUserTemplateUrl: 'deleteUserTemplateUrl.html',
		deleteUserPlacement: 'right'
	};
	$scope.modals = {
		userModal: "app/frontend/includes/modals/userModal.html"
	};
	$scope.editingUser = {};
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

	$scope.setManagingUserInfo = function(userID, fname, lname){
		this.editUserData.userID = userID;
		
		if(userID !== -1)
			this.editingUser.title = 'Editing user: ' + fname + ' ' + lname;
		else
			this.editingUser.title = 'Add user';
	}

	function displayUsers(){
		userService.displayUsers(
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

	$scope.addUser = function(){
		$('#userModal').modal('hide');
		userService.addUser(
			this.editUserData,
			function(response){
				displayUsers();
			}, function(response){
				console.log(response);
			}
		);
	}

	$scope.editUser = function(){
		$('#userModal').modal('hide');
		userService.editUser(
			this.editUserData,
			function(response){
				displayUsers();
			}, function(response){
				console.log(response);
			}
		);
	}

	$scope.deleteUser = function(){
		userService.deleteUser(
			this.userToDeleteID,
			function(response){
				displayUsers();
			}, function(response){
				console.log(response);
			}
		);
	}
});