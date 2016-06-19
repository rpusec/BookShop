app.controller('catalogueContr', function($scope, catalogueService, authService){
	$scope.books = null;
	$scope.pagination = {
		totalItems: null,
		currentPage: 1,
		itemsPerPage: 5,
		onPageChange: function(){
			getCatalogue();
		}
	};

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
				{
					console.log(response);
					authService.logout({
						message: response.data.message
					});
				}
			}
		);
	}

	function getCatalogue(){
		catalogueService.getCatalogue(
			$scope.pagination.currentPage,
			$scope.pagination.itemsPerPage,
			function(response){
				if(response.data.authenticated)
				{
					$scope.books = response.data.books;
					$scope.pagination.totalItems = response.data.bookCount;
				}
				else
				{
					authService.logout({
						message: response.data.message
					});
				}
			}
		);
	}

	function displaySuccessMessage(message){
		$.notify(message, {className:'success', position: 'top center'});
	}
});