app.service('authService', function($http, $location, $window){
	this.login = function(username, password, afterSuccess, onError){
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
					user.username);

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

			console.log(response);

			if(typeof afterSuccess === 'function')
				afterSuccess();
		}, onError);
	}

	this.logout = function(params){
		params = $.extend({
			afterSuccess: null,
			onError: null,
			message: null
		}, params);
		$http({
			method: 'GET',
			url: 'app/backend/view/userview.php',
			params: {funct: 'logout-user'}
		}).then(function(response){
			console.log(response);
			$.notify(params.message === null ? response.data.message : params.message, {
				position: 'top center',
				className: response.data.logoutSuccess ? 'success' : 'error'
			});
			if(response.data.logoutSuccess)
			{
				console.log('test');
				$location.path('/login');
			}
			session = null;
			if(typeof params.afterSuccess === 'function')
				params.afterSuccess();
		}, params.onError);
	}

	function createSession(userID, fname, lname, username){
		$window.localStorage.setItem('UserSession', {
			userID: userID,
			lname: lname,
			fname: fname,
			username: username
		});
	}

	this.getSession = function(){
		return $window.localStorage.getItem('UserSession');
	}

	this.destroySession = function(){
		$window.localStorage.removeItem('UserSession');
	};

	this.isAuthenticated = function(){
		return this.getSession() !== null;
	}
});