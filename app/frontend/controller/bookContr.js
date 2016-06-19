app.controller('bookContr', function($scope, bookService, authService){
	$scope.books = null;
	$scope.popover = {
		deleteBookTemplateUrl: 'deleteBookTemplateUrl.html',
		addBookCopiesTemplateUrl: 'addBookCopiesTemplateUrl.html',
		popoverPlacement: 'top'
	};
	$scope.modals = {
		bookModal: "app/frontend/includes/modals/bookModal.html",
		bookCopiesModal: "app/frontend/includes/modals/bookCopiesModal.html"
	};
	$scope.editingBook = {};
	$scope.bookToDeleteID = -1;
	$scope.targetDelBookCopyNum = 0;
	$scope.editingBookData = {};
	$scope.pagination = {
		totalItems: null,
		currentPage: 1,
		itemsPerPage: 5,
		onPageChange: function(){
			displayBooks();
		}
	};
	$scope.bookCopiesToAddID = null;
	$scope.bookAmountToAdd = 0;

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

	$scope.addBook = function(){
		$('#bookModal').modal('hide');
		bookService.addBook(
			this.editingBookData,
			function(response){
				if(response.data.authenticated)
				{
					displayBooks();
					displaySuccessMessage(response.data.message);
				}
				else
					authService.logout({
						message: response.data.message
					});
			}
		);
	}

	$scope.editBook = function(){
		$('#bookModal').modal('hide');
		bookService.editBook(
			this.editingBookData,
			function(response){
				if(response.data.authenticated)
				{
					displayBooks();
					displaySuccessMessage(response.data.message);
				}
				else
					authService.logout({
						message: response.data.message
					});
			}
		);
	}

	$scope.deleteBook = function(){
		bookService.deleteBook(
			this.bookToDeleteID,
			function(response){
				if(response.data.authenticated)
				{
					displayBooks();
					displaySuccessMessage(response.data.message);
				}
				else
					authService.logout({
						message: response.data.message
					});
			}
		);
	}

	$scope.displayBookCopies = function(bookID, bookTitle){
		$scope.$broadcast('bookCopyInfoEvent', {
			bookID: bookID,
			bookTitle: bookTitle
		});
	}

	$scope.addBookCopies = function(){
		bookService.addBookCopies(
			this.bookCopiesToAddID,
			this.bookAmountToAdd,
			function(response){
				if(response.data.authenticated)
				{
					displayBooks();
					displaySuccessMessage(response.data.message);
				}
				else
					authService.logout({
						message: response.data.message
					});
			}
		);
	}

	$scope.$on('updateListAfterDeletingCopies', function(e){
		displayBooks();
	});

	function displaySuccessMessage(message){
		$.notify(message, {className:'success', position: 'top center'});
	}
});

app.controller('bookCopiesContr', function($scope, bookService){
	$scope.bookTitle = null;
	$scope.bookID = null;
	$scope.bookCopies = null;
	$scope.metadata = ['CopyID', 'Purchaser'];
	$scope.pagination = {
		totalItems: null,
		currentPage: 1,
		itemsPerPage: 5,
		onPageChange: function(){
			displayBookCopies();
		}
	};

	$scope.$on('bookCopyInfoEvent', function(e, data){
		$scope.bookID = data.bookID;
		$scope.bookTitle = data.bookTitle;
		displayBookCopies();
	});

	function displayBookCopies(){
		bookService.displayBookCopies(
			$scope.bookID,
			$scope.pagination.currentPage,
			$scope.pagination.itemsPerPage,
			function(response){
				if(response.data.authenticated)
				{
					$scope.bookCopies = response.data.bookCopies;
					$scope.pagination.totalItems = response.data.bookCopyCount;
				}
				else
					authService.logout({
						message: response.data.message
					});
			}
		);
	}

	$scope.deleteBookCopies = function(){
		bookService.deleteBookCopies(
			this.bookCopies,
			function(response){
				if(response.data.authenticated)
				{
					displayBookCopies();
					$scope.$emit('updateListAfterDeletingCopies');
					displaySuccessMessage(response.data.message);
				}
				else
					authService.logout({
						message: response.data.message
					});
			}
		);
	}

	$scope.selectAllCopies = function(){
		var allSelected = true;

		angular.forEach(this.bookCopies, function(val){
			if(!val.hasOwnProperty('selected') || !val.selected)
				allSelected = false;
		});

		angular.forEach(this.bookCopies, function(val){
			if(!allSelected)
				val.selected = true;
			else
				val.selected = false;
		});
	}

	function displaySuccessMessage(message){
		$.notify(message, {className:'success', position: 'top center'});
	}
});