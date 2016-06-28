/**
 * Handles all of the processes regarding a user's shopping cart. 
 * @see cartService
 * @author Roman Pusec
 */
app.controller('cartContr', function($scope, $location, cartService, authService){
	if(!authService.isAuthenticated())
	{
		$location.path('/login');
		return;
	}

	$scope.books = null;
	$scope.balance = 0;
	$scope.pagination = {
		totalItems: null,
		currentPage: 1,
		itemsPerPage: 5,
		onPageChange: function(){
			$scope.getBooksFromCart();
		}
	};
	
	/**
	 * Fetches all of the books from the 
	 * authenticated user's shopping cart. 
	 * @see cartService.getBooksFromCart
	 */
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

	/**
	 * Removes a book copy from the shopping cart. 
	 * @see cartService.removeFromCart
	 * @param  {Integer} bookID The database ID value of the book (not the book copy). 
	 */
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

	$scope.getBooksFromCart();

	/**
	 * Displays the success message. 
	 * @param  {String} message The message. 
	 */
	function displaySuccessMessage(message){
		$.notify(message, {className:'success', position: 'top center'});
	}
});