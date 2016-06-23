app.controller("userContr", function($scope, userService, authService){
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
				if(response.data.authenticated)
				{
					$scope.users = response.data.users;
					$scope.pagination.totalItems = response.data.userCount;
				}
				else
					authService.logout({
						message: response.data.message
					});
			}
		);
	}

	$scope.addUser = function(){
		$('#userModal').modal('hide');
		userService.addUser(
			this.editUserData,
			addEditResp);
	}

	$scope.editUser = function(){
		$('#userModal').modal('hide');
		userService.editUser(
			this.editUserData,
			addEditResp);
	}

	function addEditResp(){
		if(response.data.authenticated)
		{
			if(!response.data.hasErrors)
			{
				displayBooks();
				displaySuccessMessage(response.data.message);
				$('#userModal').modal('hide');
			}
			else
			{
				angular.forEach(response.data.errors, function(errorMessage, errorKey){
					$scope.editingBookData[errorKey + '_error'] = true;
					$.notify(errorMessage, {className: 'error', position: 'top center'});
				});
			}
		}
		else
			authService.logout({
				message: response.data.message
			});
	}

	$scope.deleteUser = function(){
		userService.deleteUser(
			this.userToDeleteID,
			function(response){
				if(response.data.authenticated)
				{
					displayUsers();
					displaySuccessMessage(response.data.message);
				}
				else
					authService.logout({
						message: response.data.message
					});
			}
		);
	}

	function displaySuccessMessage(message){
		$.notify(message, {className:'success', position: 'top center'});
	}
});