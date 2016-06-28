/**
 * It is used for general authentication logic. 
 *
 * The 'session' in this service represents some of the 
 * data of the user who's authenticated on the website,
 * and is used at specific parts of the website (e.g. the
 * fname and lname parameters are used on the navigation
 * bar, userID is used to send the ID of the user when
 * altering user settings, and is_admin is used to 
 * evaluate whether the user is an administrator).  
 * 
 * @author Roman Pusec
 */
app.service('authService', function($rootScope, $http, $location, $window){
	var authService = {};

	/**
	 * Used for authenticating the user. 
	 * @param  {String}   username     The username. 
	 * @param  {String}   password     The password. 
	 * @param  {Function} afterSuccess Function which is executed after success. 
	 * @param  {Function} onError      Function which is executed on error. 
	 */
	authService.login = function(username, password, afterSuccess, onError){
		$http({
			method: 'POST',
			url: 'app/backend/view/userview.php',
			params: {
				funct: 'login-user', 
				username: username, 
				password: password
			}
		}).then(function(response){
			if(response.data.loginSuccess)
			{
				var user = response.data.user;
				
				createSession(
					user.userID, 
					user.fname, 
					user.lname,
					user.username,
					user.is_admin);

				$.notify(response.data.message, {
					className: 'success',
					position: 'top center'
				});
				$location.path('/catalouge');
			}
			else
			{
				$('#loginForm').notify(response.data.message, {
					position: 'top center',
					className: 'error',
					autoHideDelay: 2000
				});
			}

			if(typeof afterSuccess === 'function')
				afterSuccess(response);
		}, onError);
	}

	/**
	 * Logs the user our of the system. The parameters are as follows: 
	 * 
	 *  * afterSuccess - Specifies what will happen after successful execution of the $http object. 
	 *  * onError - Specifies what will happen if the $http request was unsuccessful. 
	 *  * message - The message to display. If not specified, the message from the server will be displayed. 
	 *  * messageType - The message type. If not specified, the message type will be determined by whether 
	 *                  the logout was successful or not. 
	 * 
	 * @param  {Object} params The parameters. 
	 */
	authService.logout = function(params){
		params = $.extend({
			afterSuccess: null,
			onError: null,
			message: null,
			messageType: null
		}, params);
		$http({
			method: 'GET',
			url: 'app/backend/view/userview.php',
			params: {funct: 'logout-user'}
		}).then(function(response){
			$.notify(params.message === null ? response.data.message : params.message, {
				position: 'top center',
				className: !params.messageType ? (response.data.logoutSuccess ? 'success' : 'error') : params.messageType
			});

			if(response.data.logoutSuccess)
			{
				authService.destroySession();
				$rootScope.$broadcast('updateNavbarState');
				$location.path('/login');
			}

			if(typeof params.afterSuccess === 'function')
				params.afterSuccess();
		}, params.onError);
	}

	/**
	 * Defines the session. The session is stored with localStorage. 
	 * @param  {String}  userID   The database ID of the user. 
	 * @param  {String}  fname    The first name.
	 * @param  {String}  lname    The last name.
	 * @param  {String}  username The username. 
	 * @param  {Boolean} isAdmin  Whether the user is admin. 
	 */
	function createSession(userID, fname, lname, username, isAdmin){
		$window.localStorage.setItem('UserSession', angular.toJson({
			userID: userID,
			lname: lname,
			fname: fname,
			username: username,
			isAdmin: isAdmin
		}));
	}

	/**
	 * Updates the user's session in the client side. 
	 * @param  {Function} onSuccess Is executed after the session was updated. 
	 */
	authService.updateSession = function(onSuccess){
		if(!this.isAuthenticated())
			return;

		$http({
			method: 'GET',
			url: 'app/backend/view/userview.php',
			params: {funct: 'get-user', userID: this.getSession().userID}
		}).then(function(response){
			if(response.data.authenticated && response.data.isAuthUser)
			{
				var data = response.data.user;
				createSession(
					data.userID,
					data.fname,
					data.lname,
					data.username,
					parseInt(data.is_admin));
				onSuccess(response);
			}
			else
				authService.logout({
					message: response.data.message,
					messageType: 'error'
				});
		});
	}

	/**
	 * Returns the session in JS object format. 
	 * @return {Object|null} The session, null is returned if the session does not exist. 
	 */
	authService.getSession = function(){
		if(typeof $window.localStorage.getItem('UserSession') === 'string')
			return angular.fromJson($window.localStorage.getItem('UserSession'));
		return null;
	}

	/**
	 * Destroys the session. 
	 */
	authService.destroySession = function(){
		$window.localStorage.removeItem('UserSession');
	};

	/**
	 * Checks whether the session exists. 
	 * @return {Boolean} True if the session exists, false otherwise. 
	 */
	authService.isAuthenticated = function(){
		return authService.getSession() !== null;
	}

	/**
	 * Checks whether the user is an admin. 
	 * @return {Boolean} True if the user's an admin, false otherwise. 
	 */
	authService.isAdmin = function(){
		if(!this.isAuthenticated())
			return false;

		var session = authService.getSession();
		return session.isAdmin;
	}

	return authService;
});