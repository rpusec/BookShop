app.service('bookService', function($http){
	this.displayBooks = function(currentPage, itemsPerPage, onSuccess, onError){
		$http({
			method: 'GET',
			url: 'app/backend/view/bookview.php',
			params: {
				funct: 'get-books', 
				currentPage: currentPage,
				perPage: itemsPerPage
			}
		}).then(onSuccess, onError);
	}

	this.displayBookCopies = function(bookID, currentPage, itemsPerPage, onSuccess, onError){
		$http({
			method: 'GET',
			url: 'app/backend/view/bookview.php',
			params: {
				funct: 'get-book-copies',
				bookID: bookID, 
				currentPage: currentPage,
				perPage: itemsPerPage
			}
		}).then(function(response){
			if(response.data.bookCopies !== null)
			{
				angular.forEach(response.data.bookCopies, function(copy){
					if(copy.fname !== null && copy.lname !== null)
						copy.purchaser = copy.fname + ' ' + copy.lname;
					else
						copy.purchaser = 'Unknown';
				});
			}
			onSuccess(response);
		}, onError);
	}

	this.deleteBook = function(bookToDeleteID, onSuccess, onError){
		$http({
			method: 'GET',
			url: 'app/backend/view/bookview.php',
			params: {funct: 'delete-book', bookID: bookToDeleteID}
		}).then(onSuccess, onError);
	}

	this.deleteBookCopies = function(arrBookCopies, onSuccess, onError){
		var strBookCopyIDs = '';

		angular.forEach(arrBookCopies, function(copy, key){
			if(copy.selected)
			{
				strBookCopyIDs += copy.book_copy_id;
				strBookCopyIDs += '|';	
			}
		});

		//remove last '|' character
		strBookCopyIDs = strBookCopyIDs.substr(0, strBookCopyIDs.length-1);

		$http({
			method: 'GET',
			url: 'app/backend/view/bookview.php',
			params: {funct: 'delete-book-copies', strBookCopyIDs: strBookCopyIDs}
		}).then(onSuccess, onError);
	}

	this.addBook = function(bookData, onSuccess, onError){
		bookData.funct = 'add-book';
		addEditBook(bookData, onSuccess, onError);
	}

	this.addBookCopies = function(bookID, copyAmount, onSuccess, onError){
		$http({
			method: 'GET',
			url: 'app/backend/view/bookview.php',
			params: {
				funct: 'add-book-copies', 
				bookID: bookID,
				copyAmount: copyAmount
			}
		}).then(onSuccess, onError);
	}

	this.editBook = function(bookData, onSuccess, onError){
		bookData.funct = 'edit-book';
		addEditBook(bookData, onSuccess, onError);
	}

	function addEditBook(bookData, onSuccess, onError){
		$http({
			method: 'GET',
			url: 'app/backend/view/bookview.php',
			params: bookData
		}).then(function(response){
			angular.forEach(bookData, function(value, key){
				bookData[key] = '';
			});
			onSuccess(response);
		}, onError);
	}	
});