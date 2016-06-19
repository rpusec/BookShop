app.controller('cartContr', function($scope, $location, cartService, authService){
	if(!authService.isAuthenticated())
		$location.path('/login');

	$scope.books = null;
	$scope.pagination = {
		totalItems: null,
		currentPage: 1,
		itemsPerPage: 5,
		onPageChange: function(){
			getBooksFromCart();
		}
	};
	$scope.balance = 0;

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
					$scope.balance = response.data.balance;
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