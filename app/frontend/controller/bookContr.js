app.controller('bookContr', function($scope, bookService){
	$scope.books = null;
	$scope.popover = {
		deleteBookTemplateUrl: 'deleteBookTemplateUrl.html',
		deleteBookPlacement: 'top'
	};
	$scope.modals = {
		bookModal: "app/frontend/includes/modals/bookModal.html"
	};
	$scope.editingBook = {};
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

	$scope.setManagingBookInfo = function(bookID, title, author){
		this.editingBookData.bookID = bookID;
		
		if(bookID !== -1)
			this.editingBook.title = 'Editing book: ' + title + ' written by ' + author;
		else
			this.editingBook.title = 'Add book';
	}

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
			this.editingBookData,
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
			this.editingBookData,
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
				console.log(response);
				displayBooks();
			}, function(response){
				console.log(response);
			}
		);
	}

	$scope.addBookCopies = function(){
		
	}
});