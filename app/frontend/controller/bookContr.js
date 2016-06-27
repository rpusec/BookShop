app.controller('bookContr', function($scope, $uibModal, bookService, authService){
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
	$scope.pagination = {
		totalItems: null,
		currentPage: 1,
		itemsPerPage: 3,
		onPageChange: function(){
			$scope.displayBooks();
		}
	};
	$scope.bookCopiesToAddID = null;
	$scope.bookAmountToAdd = 0;

	$scope.setManagingBookInfo = function(bookID, title, author){
		this.editingBook.bookID = bookID;
		
		if(bookID !== -1)
			this.editingBook.title = 'Editing book: ' + title + ' written by ' + author;
		else
			this.editingBook.title = 'Add book';
	}

	$scope.displayBooks = function(){
		bookService.displayBooks(
			$scope.pagination.currentPage, 
			$scope.pagination.itemsPerPage,
			typeof $scope.searchOptions === 'undefined' ? null : !$scope.searchOptions.searchMode ? null : $scope.searchOptions.chosenSeachBy,
			typeof $scope.searchOptions === 'undefined' ? null : !$scope.searchOptions.searchMode ? null : $scope.searchOptions.chosenFilter,
			function(response){
				if(response.data.authenticated)
				{
					$scope.books = response.data.books;
					$scope.pagination.totalItems = response.data.bookCount;
				}
				else
					authService.logout({
						message: response.data.message,
						messageType: 'error'
					});
			}
		);
	}

	$scope.displayBooks();

	$scope.openBookModal = function(){
		var m = $uibModal.open({
			controller: 'entityModalContr',
			templateUrl: 'bookModal.html',
			resolve: {
				editingEntity: function(){
					return $scope.editingBook;
				},
				entityService: bookService,
				functNames: function(){
					return {
						editingEntityData: 'editingBookData',
						editingEntity: 'editingBook',
						addEntity: 'addBook',
						editEntity: 'editBook',
						entityIDLabel: 'bookID'
					}
				}
			}
		});

		m.closed.then(function(result){
			$scope.displayBooks();
		});

		return m;
	}

	$scope.deleteBook = function(){
		bookService.deleteBook(
			this.bookToDeleteID,
			function(response){
				if(response.data.authenticated)
				{
					$scope.displayBooks();
					displaySuccessMessage(response.data.message);
				}
				else
					authService.logout({
						message: response.data.message,
						messageType: 'error'
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
				console.log(response);
				if(response.data.authenticated)
				{
					if(!response.data.hasErrors)
					{
						$scope.displayBooks();
						displaySuccessMessage(response.data.message);
					}
					else
					{
						angular.forEach(response.data.errors, function(errorMessage, errorKey){
							$.notify(errorMessage, {className: 'error', position: 'top center'});
						});
					}
				}
				else
					authService.logout({
						message: response.data.message,
						messageType: 'error'
					});
			}
		);
	}

	$scope.$on('updateBooks', function(e){
		$scope.displayBooks();
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
						message: response.data.message,
						messageType: 'error'
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
					$scope.$emit('updateBooks');
					displaySuccessMessage(response.data.message);
				}
				else
					authService.logout({
						message: response.data.message,
						messageType: 'error'
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

	$scope.isOneCopySelected = function(){
		var atLeastOneSelected = false;

		angular.forEach(this.bookCopies, function(copy){
			if(copy.hasOwnProperty('selected') && copy.selected)
			{
				atLeastOneSelected = true;
				return false;
			}
		});

		return atLeastOneSelected;
	}

	function displaySuccessMessage(message){
		$.notify(message, {className:'success', position: 'top center'});
	}
});