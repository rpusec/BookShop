app.service('catalogueService', function($http){
	this.getCatalogue = function(currentPage, itemsPerPage, searchBy, filter, onSuccess, onError){
		var params = {
			funct: 'get-catalogue', 
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

	this.addToCart = function(bookID, onSuccess, onError){
		$http({
			method: 'GET',
			url: 'app/backend/view/bookview.php',
			params: {
				funct: 'add-book-to-cart', 
				bookID: bookID
			}
		}).then(onSuccess, onError);
	}
});