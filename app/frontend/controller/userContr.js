/**
 * Handles all of the functionality for the user entities. 
 * @author Roman Pusec
 * @see userService
 */
app.controller("userContr", function($scope, $uibModal, userService, authService){
	$scope.users = null;
	$scope.metadata = ['First name', 'Last name', 'Username', 'Amount', 'Admin', 'Edit', 'Delete'];
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
			$scope.displayUsers();
		}
	};

	/**
	 * Sets the user information which is related to editing or adding a user. 
	 * @param {Integer} userID The database ID value of the user. 
	 * @param {String} fname  The first name of the user. 
	 * @param {String} lname The last name of the user. 
	 */
	$scope.setManagingUserInfo = function(userID, fname, lname){
		this.editingUser.userID = userID;
		
		if(userID !== -1)
			this.editingUser.title = 'Editing user: ' + fname + ' ' + lname;
		else
			this.editingUser.title = 'Add user';
	}

	/**
	 * Displays the users from the userService. 
	 * @see userService.displayUsers
	 */
	$scope.displayUsers = function(){
		userService.displayUsers(
			$scope.pagination.currentPage, 
			$scope.pagination.itemsPerPage,
			typeof $scope.searchOptions === 'undefined' ? null : !$scope.searchOptions.searchMode ? null : $scope.searchOptions.chosenSeachBy,
			typeof $scope.searchOptions === 'undefined' ? null : !$scope.searchOptions.searchMode ? null : $scope.searchOptions.chosenFilter,
			function(response){
				console.log(response);
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

	$scope.displayUsers();

	/**
	 * Opens the modal window for editing or adding a user. 
	 * @see entityModalContr for more info. 
	 */
	$scope.openUserModal = function(){
		var m = $uibModal.open({
			controller: 'entityModalContr',
			templateUrl: 'userModal.html',
			resolve: {
				editingEntity: function(){
					return $scope.editingUser;
				},
				entityService: userService,
				functNames: function(){
					return {
						editingEntityData: 'editingUserData',
						editingEntity: 'editingUser',
						addEntity: 'addUser',
						editEntity: 'editUser',
						entityIDLabel: 'userID'
					}
				}
			}
		});

		m.closed.then(function(result){
			$scope.displayUsers();
		});

		return m;
	}

	/**
	 * Deletes a specific user. 
	 * @see userService.deleteUser
	 */
	$scope.deleteUser = function(){
		userService.deleteUser(
			this.userToDeleteID,
			function(response){
				if(response.data.authenticated)
				{
					$scope.displayUsers();
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

	/**
	 * Displays the success message. 
	 * @param  {String} message The message. 
	 */
	function displaySuccessMessage(message){
		$.notify(message, {className:'success', position: 'top center'});
	}
});