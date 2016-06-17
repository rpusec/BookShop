app.controller('bookContr', function($scope, bookService){
	$scope.books = null;
	$scope.popover = {
		deleteUserTemplateUrl: 'deleteBookTemplateUrl.html',
		deleteUserPlacement: 'right'
	};
	$scope.bookToDeleteID = -1;
	$scope.editingBookData = {};
	$scope.pagination = {
		totalItems: null,
		currentPage: 1,
		itemsPerPage: 5,
		onPageChange: function(){
			displayBooks();
		}
	};

	displayBooks();

	function displayBooks(){
		bookService.displayBook(
			$scope.pagination.currentPage, 
			$scope.pagination.itemsPerPage,
			function(response){
				$scope.books = response.data.books;
				$scope.pagination.totalItems = response.data.bookCount;
			},
			function(response){
				console.log(response);
			}
		);
	}

	$scope.addBook = function(){
		$('#bookModal').modal('hide');
		bookService.addBook(
			this.editUserData,
			function(response){
				displayBooks();
			}, function(response){
				console.log(response);
			}
		);
	}

	$scope.editBook = function(){
		$('#bookModal').modal('hide');
		bookService.editBook(
			this.editUserData,
			function(response){
				displayBooks();
			}, function(response){
				console.log(response);
			}
		);
	}

	$scope.deleteBook = function(){
		bookService.deleteBook(
			this.bookToDeleteID,
			function(response){
				displayBooks();
			}, function(response){
				console.log(response);
			}
		);
	}
});