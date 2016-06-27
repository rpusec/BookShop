app.service("userService", function($http){
	this.displayUsers = function(currentPage, itemsPerPage, searchBy, filter, onSuccess, onError){
		var params = {
			funct: 'get-users', 
			currentPage: currentPage,
			perPage: itemsPerPage
		}

		if(searchBy !== null)
			params['searchBy'] = searchBy;

		if(filter !== null)
			params['filter'] = filter;

		$http({
			method: 'GET',
			url: 'app/backend/view/userview.php',
			params: params
		}).then(onSuccess, onError);
	}

	this.deleteUser = function(userToDeleteID, onSuccess, onError){
		$http({
			method: 'GET',
			url: 'app/backend/view/userview.php',
			params: {funct: 'delete-user', userID: userToDeleteID}
		}).then(onSuccess, onError);
	}

	this.addUser = function(userData, onSuccess, onError){
		userData.funct = 'add-user';
		addEditUser(userData, onSuccess, onError);
	}

	this.editUser = function(userData, onSuccess, onError){
		userData.funct = 'edit-user';
		addEditUser(userData, onSuccess, onError);
	}

	function addEditUser(userData, onSuccess, onError){
		$http({
			method: 'GET',
			url: 'app/backend/view/userview.php',
			params: userData
		}).then(function(response){
			onSuccess(response);
		}, onError);
	}	
});