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
				if(response.data.authenticated)
				{
					getCatalogue();
					displaySuccessMessage(response.data.message);
				}
				else
					authService.logout({
						message: response.data.message
					});
			}
		);
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

	function displaySuccessMessage(message){
		$.notify(message, {className:'success', position: 'top center'});
	}
});