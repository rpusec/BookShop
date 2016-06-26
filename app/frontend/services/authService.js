app.service('authService', function($http, $location, $window, observerService){
	var authService = {};

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
				observerService.notifyAll('auth');
				$location.path('/login');
			}
			if(typeof params.afterSuccess === 'function')
				params.afterSuccess();
		}, params.onError);
	}

	function createSession(userID, fname, lname, username, isAdmin){
		$window.localStorage.setItem('UserSession', angular.toJson({
			userID: userID,
			lname: lname,
			fname: fname,
			username: username,
			isAdmin: isAdmin
		}));
	}

	authService.updateSession = function(onSuccess){
		if(!this.isAuthenticated())
			return;

		$http({
			method: 'GET',
			url: 'app/backend/view/userview.php',
			params: {funct: 'get-user', userID: this.getSession().userID}
		}).then(function(response){
			if(response.data.authenticated)
			{
				var data = response.data.user;
				console.log(data);
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

	authService.getSession = function(){
		if(typeof $window.localStorage.getItem('UserSession') === 'string')
			return angular.fromJson($window.localStorage.getItem('UserSession'));
		return null;
	}

	authService.destroySession = function(){
		$window.localStorage.removeItem('UserSession');
	};

	authService.isAuthenticated = function(){
		return authService.getSession() !== null;
	}

	authService.isAdmin = function(){
		if(!this.isAuthenticated())
			return false;

		var session = authService.getSession();
		return session.isAdmin;
	}

	return authService;
});