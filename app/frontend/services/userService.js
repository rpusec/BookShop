/**
 * Handles all of the processes regarding a users. 
 */
app.service("userService", function($http){

	/**
	 * Fetches the user objects from the server. 
	 * @param  {Integer}  currentPage  The current page. 
	 * @param  {Integer}  itemsPerPage Items per page. 
	 * @param  {String}   searchBy     The keyword to search by. 
	 * @param  {String}   filter       The search filter. Can be any column from the database. 
	 * @param  {Function} onSuccess    The function which is executed on success. 
	 * @param  {Function} onError      The function which is executed on error. 
	 */
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

		useHttp(params, onSuccess, onError);
	}

	/**
	 * Adds a user. 
	 * @param  {Object}   userData     The data of the new user.  
	 * @param  {Function} onSuccess    The function which is executed on success. 
	 * @param  {Function} onError      The function which is executed on error. 
	 */
	this.addUser = function(userData, onSuccess, onError){
		userData.funct = 'add-user';
		useHttp(userData, onSuccess, onError);
	}

	/**
	 * Edits a user. 
	 * @param  {Object}   userData     The new data of the user. 
	 * @param  {Function} onSuccess    The function which is executed on success. 
	 * @param  {Function} onError      The function which is executed on error. 
	 */
	this.editUser = function(userData, onSuccess, onError){
		userData.funct = 'edit-user';
		useHttp(userData, onSuccess, onError);
	}

	/**
	 * Removes a user. 
	 * @param  {Integer}  userID       The database ID of a user. 
	 * @param  {Function} onSuccess    The function which is executed on success. 
	 * @param  {Function} onError      The function which is executed on error. 
	 */
	this.deleteUser = function(userID, onSuccess, onError){
		useHttp({funct: 'delete-user', userID: userID}, onSuccess, onError);
	}

	/**
	 * Referenced by the other functions. 
	 * @param {Object}   params        Represents the parameters to be referenced. 
	 * @param {Function} onSuccess     The function which is executed on success. 
	 * @param {Function} onError       The function which is executed on error. 
	 */
	function useHttp(params, onSuccess, onError){
		$http({
			method: 'GET',
			url: 'app/backend/view/userview.php',
			params: params
		}).then(onSuccess, onError);
	}	
});