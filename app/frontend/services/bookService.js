app.service('bookService', function($http){
	this.displayBook = function(currentPage, itemsPerPage, onSuccess, onError){
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

	this.deleteBook = function(bookToDeleteID, onSuccess, onError){
		$http({
			method: 'GET',
			url: 'app/backend/view/bookview.php',
			params: {funct: 'delete-book', bookID: bookToDeleteID}
		}).then(onSuccess, onError);
	}

	this.addBook = function(bookData, onSuccess, onError){
		bookData.funct = 'add-book';
		addEditBook(bookData, onSuccess, onError);
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