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
						message: response.data.message,
						messageType: 'error'
					});
			}
		);
	}

	$scope.addUser = function(){
		userService.addUser(
			this.editUserData,
			addEditResp);
	}

	$scope.editUser = function(){
		userService.editUser(
			this.editUserData,
			addEditResp);
	}

	function addEditResp(response){
		if(response.data.authenticated)
		{
			if(!response.data.hasErrors)
			{
				displayUsers();
				displaySuccessMessage(response.data.message);
				$('#userModal').modal('hide');
				$('#userModal').find('.has-error').removeClass('has-error');
			}
			else
			{
				angular.forEach(response.data.errors, function(errorMessage, errorKey){
					$scope.editUserData[errorKey + '_error'] = true;
					$.notify(errorMessage, {className: 'error', position: 'top center'});
				});
			}
		}
		else
			authService.logout({
				message: response.data.message,
				messageType: 'error'
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
						message: response.data.message,
						messageType: 'error'
					});
			}
		);
	}

	function displaySuccessMessage(message){
		$.notify(message, {className:'success', position: 'top center'});
	}
});