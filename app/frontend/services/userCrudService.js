var app = angular.module("services", []);

app.service("userCrud", function($http){
	this.displayUsers = function(currentPage, itemsPerPage, onSuccess, onError){
		$http({
			method: 'GET',
			url: 'app/backend/view/userview.php?',
			params: {
				funct: 'get-users', 
				currentPage: currentPage,
				perPage: itemsPerPage
			}
		}).then(onSuccess, onError);
	}

	this.deleteUser = function(userToDeleteID, onSuccess, onError){
		$http({
			method: 'GET',
			url: 'app/backend/view/userview.php',
			params: {funct: 'delete-user', userID: userToDeleteID}
		}).then(onSuccess, onError);
	}

	this.editUser = function(editUserData, onSuccess, onError){
		editUserData.funct = 'edit-user';
		$http({
			method: 'GET',
			url: 'app/backend/view/userview.php',
			params: editUserData
		}).then(function(){
			angular.forEach(editUserData, function(value, key){
				editUserData[key] = '';
			});
			onSuccess();
		}, onError);
	}
});