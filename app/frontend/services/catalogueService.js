/**
 * Handles all of the processes regarding the catalogue. 
 * @author Roman Pusec
 */
app.service('catalogueService', function($http){

	/**
	 * Fetches the book objects from the server. 
	 * @param  {Integer}  currentPage  The current page. 
	 * @param  {Integer}  itemsPerPage Items per page. 
	 * @param  {String}   searchBy     The keyword to search by. 
	 * @param  {String}   filter       The search filter. Can be any column from the database. 
	 * @param  {Function} onSuccess    The function which is executed on success. 
	 * @param  {Function} onError      The function which is executed on error. 
	 */
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

	/**
	 * Adds a book copy to the user's cart. 
	 * @param  {Integer}  bookID       The database ID of a book. 
	 * @param  {Function} onSuccess    The function which is executed on success. 
	 * @param  {Function} onError      The function which is executed on error. 
	 */
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