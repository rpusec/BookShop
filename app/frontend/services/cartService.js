app.service('cartService', function($http){
	this.getBooksFromCart = function(currentPage, itemsPerPage, onSuccess, onError){
		$http({
			method: 'GET',
			url: 'app/backend/view/bookview.php',
			params: {
				funct: 'get-books-from-cart', 
				currentPage: currentPage,
				perPage: itemsPerPage
			}
		}).then(onSuccess, onError);
	}

	this.removeFromCart = function(bookID, onSuccess, onError){
		$http({
			method: 'GET',
			url: 'app/backend/view/bookview.php',
			params: {
				funct: 'remove-book-from-cart', 
				bookID: bookID
			}
		}).then(onSuccess, onError);
	}
});