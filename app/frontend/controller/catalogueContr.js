/**
 * Handles all business logic regarding the book catalogue.
 * @author Roman Pusec 
 */
app.controller('catalogueContr', function($scope, $location, catalogueService, authService){
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
		itemsPerPage: 3,
		onPageChange: function(){
			$scope.getCatalogue();
		}
	};

	/**
	 * Adds a book to the authenticated user's shopping cart. 
	 * @param {Integer} bookID The database ID of the book. 
	 * @see catalogueService.addToCart
	 */
	$scope.addToCart = function(bookID){
		catalogueService.addToCart(
			bookID,
			function(response){
				console.log(response);
				if(response.data.authenticated)
				{
					$scope.getCatalogue();
					displayMessage(response.data.message, response.data.canAfford ? 'success' : 'warning');
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
	 * Checks whether the specified book can be afforded. 
	 * @param  {Object} book The book object. 
	 */
	$scope.canAfford = function(book){
		return this.balance - book.price >= 0;
	}

	/**
	 * Displays all of the books that are part of the catalogue. 
	 * @see catalogueService.getCatalogue
	 */
	$scope.getCatalogue = function(){
		catalogueService.getCatalogue(
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

	$scope.getCatalogue();

	/**
	 * Displays a message using notify jquery plugin. 
	 * @param  {String} message   The message. 
	 * @param  {String} className The class name, can be 'success', 'error', or 'info'. 
	 * @see documentation on notify jquery plugin. 
	 */
	function displayMessage(message, className){
		if(typeof className !== 'string')
			className = 'success';
		$.notify(message, {className: className, position: 'top center'});
	}
});