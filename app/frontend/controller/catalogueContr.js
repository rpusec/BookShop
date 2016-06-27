app.controller('catalogueContr', function($scope, $location, catalogueService, authService){
	if(!authService.isAuthenticated())
	{
		$location.path('/login');
		return;
	}

	$scope.books = null;
	$scope.pagination = {
		totalItems: null,
		currentPage: 1,
		itemsPerPage: 3,
		onPageChange: function(){
			$scope.getCatalogue();
		}
	};
	$scope.balance = 0;

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

	$scope.canAfford = function(book){
		return this.balance - book.price >= 0;
	}

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

	function displayMessage(message, className){
		if(typeof className === 'undefined')
			className = 'success';
		$.notify(message, {className: className, position: 'top center'});
	}
});