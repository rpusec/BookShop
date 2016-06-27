app.service('cartService', function($http){
	this.getBooksFromCart = function(currentPage, itemsPerPage, searchBy, filter, onSuccess, onError){
		var params = {
			funct: 'get-books-from-cart', 
			currentPage: currentPage,
			perPage: itemsPerPage
		}

		if(searchBy !== null)
			params['searchBy'] = searchBy;

		if(filter !== null)
			params['filter'] = filter;

		$http({
			method: 'GET',
			url: 'app/backend/view/bookview.php',
			params: params
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