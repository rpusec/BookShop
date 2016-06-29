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
	$scope.userToDeleteID = -1;
	$scope.pagination = {
		totalItems: null,
		currentPage: 1,
		itemsPerPage: 5,
		onPageChange: function(){
			$scope.displayUsers();
		}
	};

	/**
	 * Displays the users from the userService. 
	 * @see userService.displayUsers
	 */
	$scope.displayUsers = function(){
		userService.displayUsers(
			$scope.pagination.currentPage, 
			$scope.pagination.itemsPerPage,
			angular.isUndefined($scope.searchOptions) ? null : !$scope.searchOptions.searchMode ? null : $scope.searchOptions.chosenSeachBy,
			angular.isUndefined($scope.searchOptions) ? null : !$scope.searchOptions.searchMode ? null : $scope.searchOptions.chosenFilter,
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

	$scope.displayUsers();

	/**
	 * Opens the modal window for editing or adding a user. 
	 * @see entityModalContr for more info. 
	 * @param {Integer} userID The database ID of the user. 
	 * @param {String}  fname  The first name. 
	 * @param {String}  lname  The last name. 
	 */
	$scope.openUserModal = function(userID, fname, lname){
		var m = $uibModal.open({
			controller: 'entityModalContr',
			templateUrl: 'userModal.html',
			resolve: {
				entityInfo: function(){
					return {
						heading: userID === null ? 'Add user' : 'Editing user ' + fname + ' ' + lname,
						userID: userID
					};
				},
				entityService: userService,
				functNames: function(){
					return {
						editingEntityData: 'editingUserData',
						entityInfo: 'userInfo',
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