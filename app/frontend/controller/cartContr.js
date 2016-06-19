app.controller('cartContr', function($scope, cartService, authService){
	$scope.books = null;
	$scope.pagination = {
		totalItems: null,
		currentPage: 1,
		itemsPerPage: 5,
		onPageChange: function(){
			getBooksFromCart();
		}
	};

	getBooksFromCart();

	$scope.removeFromCart = function(bookID){
		cartService.removeFromCart(
			bookID,
			function(response){
				if(response.data.authenticated)
				{
					getBooksFromCart();
					displaySuccessMessage(response.data.message);
				}
				else
					authService.logout({
						message: response.data.message
					});
			}
		);
	}

	function getBooksFromCart(){
		cartService.getBooksFromCart(
			$scope.pagination.currentPage,
			$scope.pagination.itemsPerPage,
			function(response){
				console.log(response);
				if(response.data.authenticated)
				{
					$scope.books = response.data.books;
					$scope.pagination.totalItems = response.data.bookCount;
				}
				else
					authService.logout({
						message: response.data.message
					});
			}
		);
	}

	function displaySuccessMessage(message){
		$.notify(message, {className:'success', position: 'top center'});
	}
});