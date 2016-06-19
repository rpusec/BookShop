app.service('catalogueService', function($http){
	this.getCatalogue = function(currentPage, itemsPerPage, onSuccess, onError){
		$http({
			method: 'GET',
			url: 'app/backend/view/bookview.php',
			params: {
				funct: 'get-catalogue', 
				currentPage: currentPage,
				perPage: itemsPerPage
			}
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