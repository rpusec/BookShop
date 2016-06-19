app.controller('catalogueContr', function($scope, $location, catalogueService, authService){
	if(!authService.isAuthenticated())
		$location.path('/login');

	$scope.books = null;
	$scope.pagination = {
		totalItems: null,
		currentPage: 1,
		itemsPerPage: 5,
		onPageChange: function(){
			getCatalogue();
		}
	};
	$scope.balance = 0;

	getCatalogue();

	$scope.addToCart = function(bookID){
		catalogueService.addToCart(
			bookID,
			function(response){
				console.log(response);
				if(response.data.authenticated)
				{
					getCatalogue();
					displayMessage(response.data.message, response.data.canAfford ? 'success' : 'warning');
				}
				else
					authService.logout({
						message: response.data.message
					});
			}
		);
	}

	$scope.canAfford = function(book){
		return this.balance - book.price >= 0;
	}

	function getCatalogue(){
		catalogueService.getCatalogue(
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

	function displayMessage(message, className){
		if(typeof className === 'undefined')
			className = 'success';
		$.notify(message, {className: className, position: 'top center'});
	}
});