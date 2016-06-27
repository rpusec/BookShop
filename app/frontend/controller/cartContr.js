app.controller('cartContr', function($scope, $location, cartService, authService){
	if(!authService.isAuthenticated())
	{
		$location.path('/login');
		return;
	}

	$scope.books = null;
	$scope.pagination = {
		totalItems: null,
		currentPage: 1,
		itemsPerPage: 5,
		onPageChange: function(){
			$scope.getBooksFromCart();
		}
	};
	$scope.balance = 0;

	$scope.removeFromCart = function(bookID){
		cartService.removeFromCart(
			bookID,
			function(response){
				if(response.data.authenticated)
				{
					$scope.getBooksFromCart();
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

	$scope.getBooksFromCart = function(){
		cartService.getBooksFromCart(
			$scope.pagination.currentPage,
			$scope.pagination.itemsPerPage,
			typeof $scope.searchOptions === 'undefined' ? null : !$scope.searchOptions.searchMode ? null : $scope.searchOptions.chosenSeachBy,
			typeof $scope.searchOptions === 'undefined' ? null : !$scope.searchOptions.searchMode ? null : $scope.searchOptions.chosenFilter,
			function(response){
				console.log(response);
				if(response.data.authenticated)
				{
					$scope.books = response.data.books;
					$scope.pagination.totalItems = response.data.bookCount;
					$scope.balance = response.data.balance;
				}
				else
					authService.logout({
						message: response.data.message,
						messageType: 'error'
					});
			}
		);
	}

	$scope.getBooksFromCart();

	function displaySuccessMessage(message){
		$.notify(message, {className:'success', position: 'top center'});
	}
});