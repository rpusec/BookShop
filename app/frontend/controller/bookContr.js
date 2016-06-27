/**
 * Handles all of the necessary processes regarding books. 
 * @author Roman Pusec
 * @see bookService 
 */
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

	/**
	 * Sets the book information which is related to editing or adding a book. 
	 * @param {Integer} bookID The database ID value of the book. 
	 * @param {String} title  The title of the book. 
	 * @param {String} author The author of the book. 
	 */
	$scope.setManagingBookInfo = function(bookID, title, author){
		this.editingBook.bookID = bookID;
		
		if(bookID !== -1)
			this.editingBook.title = 'Editing book: ' + title + ' written by ' + author;
		else
			this.editingBook.title = 'Add book';
	}

	/**
	 * Displays the books fetched from the bookService. 
	 * @see bookService.displayBooks
	 */
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

	/**
	 * Opens the modal window for editing or adding a book. 
	 * @see entityModalContr for more info. 
	 */
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

	/**
	 * Deletes a book entity, identified by 
	 * the $scope.bookToDeleteID variable. 
	 * @see bookService.deleteBook
	 */
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

	/**
	 * Displays the list of copies of a specified book. 
	 * This controller contacts its child controller (bookCopiesContr)
	 * via $broadcast event, afterwards the child controller updates
	 * its view accordingly. 
	 * @param  {[type]} bookID    The ID of the book. 
	 * @param  {[type]} bookTitle The book title. 
	 */
	$scope.displayBookCopies = function(bookID, bookTitle){
		$scope.$broadcast('displayBookCopiesEvent', {
			bookID: bookID,
			bookTitle: bookTitle
		});
	}

	/**
	 * Adds book copies. 
	 * @see bookService.addBookCopies
	 */
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

	/**
	 * Displays the success message. 
	 * @param  {String} message The message. 
	 */
	function displaySuccessMessage(message){
		$.notify(message, {className:'success', position: 'top center'});
	}
});

/**
 * Handles book copy processes. Its parent controller is 'bookContr'. 
 * @author Roman Pusec 
 */
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

	$scope.$on('displayBookCopiesEvent', function(e, data){
		$scope.bookID = data.bookID;
		$scope.bookTitle = data.bookTitle;
		displayBookCopies();
	});

	/**
	 * Displays the book copies. 
	 * @see bookService.displayBookCopies
	 */
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

	/**
	 * Deletes the book copies. 
	 * @see bookService.deleteBookCopies
	 */
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

	/**
	 * Selects all of the copies in the list. The attribute that
	 * handles the selection is called 'selected' and is bound with
	 * the view. 
	 */
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

	/**
	 * Checks if at least one copy is selected. 
	 */
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

	/**
	 * Displays the success message. 
	 * @param  {String} message The message. 
	 */
	function displaySuccessMessage(message){
		$.notify(message, {className:'success', position: 'top center'});
	}
});