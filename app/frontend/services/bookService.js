/**
 * Handles all of the service-based processes regarding books. 
 * @author Roman Pusec
 */
app.service('bookService', function($http){

	/**
	 * Fetches the book objects from the server. 
	 * @param  {Integer}  currentPage  The current page. 
	 * @param  {Integer}  itemsPerPage Items per page. 
	 * @param  {String}   searchBy     The keyword to search by. 
	 * @param  {String}   filter       The search filter. Can be any column from the database. 
	 * @param  {Function} onSuccess    The function which is executed on success. 
	 * @param  {Function} onError      The function which is executed on error. 
	 */
	this.displayBooks = function(currentPage, itemsPerPage, searchBy, filter, onSuccess, onError){
		var params = {
			funct: 'get-books', 
			currentPage: currentPage,
			perPage: itemsPerPage
		}

		if(searchBy !== null)
			params['searchBy'] = searchBy;

		if(filter !== null)
			params['filter'] = filter;

		useHttp(params, onSuccess, onError);
	}

	/**
	 * Fetches the book copy objects from the server. 
	 * @param  {Integer}  bookID       The database book ID. 
	 * @param  {Integer}  currentPage  The current page. 
	 * @param  {Integer}  itemsPerPage Items per page. 
	 * @param  {Function} onSuccess    The function which is executed on success. 
	 * @param  {Function} onError      The function which is executed on error. 
	 */
	this.displayBookCopies = function(bookID, currentPage, itemsPerPage, onSuccess, onError){
		useHttp({
			funct: 'get-book-copies',
			bookID: bookID, 
			currentPage: currentPage,
			perPage: itemsPerPage
		}, function(response){
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

	/**
	 * Deletes a book. 
	 * @param  {Integer}  bookID       The database ID of a book. 
	 * @param  {Function} onSuccess    The function which is executed on success. 
	 * @param  {Function} onError      The function which is executed on error. 
	 */
	this.deleteBook = function(bookID, onSuccess, onError){
		useHttp({funct: 'delete-book', bookID: bookID}, onSuccess, onError);
	}

	/**
	 * Deletes book copies. 
	 * @param  {Array}    arrBookCopies The array of book copy IDs. 
	 * @param  {Function} onSuccess     The function which is executed on success. 
	 * @param  {Function} onError       The function which is executed on error. 
	 */
	this.deleteBookCopies = function(arrBookCopies, onSuccess, onError){
		var strBookCopyIDs = '';

		angular.forEach(arrBookCopies, function(copy, key){
			if(copy.selected)
			{
				strBookCopyIDs += copy.book_copy_id;
				strBookCopyIDs += '|';	
			}
		});

		//removes the last '|' character
		strBookCopyIDs = strBookCopyIDs.substr(0, strBookCopyIDs.length-1);

		useHttp({
			funct: 'delete-book-copies', 
			strBookCopyIDs: strBookCopyIDs
		}, onSuccess, onError);
	}

	/**
	 * Adds a book. 
	 * @param {Object}   bookData      The object that represents book data.  
	 * @param {Function} onSuccess     The function which is executed on success. 
	 * @param {Function} onError       The function which is executed on error. 
	 */
	this.addBook = function(bookData, onSuccess, onError){
		bookData.funct = 'add-book';
		useHttp(bookData, onSuccess, onError);
	}

	this.addBookCopies = function(bookID, copyAmount, onSuccess, onError){
		useHttp({
			funct: 'add-book-copies', 
			bookID: bookID,
			copyAmount: copyAmount
		}, onSuccess, onError);
	}

	/**
	 * Edits a book. 
	 * @param {Object}   bookData      The object that represents book data.  
	 * @param {Function} onSuccess     The function which is executed on success. 
	 * @param {Function} onError       The function which is executed on error. 
	 */
	this.editBook = function(bookData, onSuccess, onError){
		bookData.funct = 'edit-book';
		useHttp(bookData, onSuccess, onError);
	}

	/**
	 * Referenced by the other functions. 
	 * @param {Object}   params        Represents the parameters to be referenced. 
	 * @param {Function} onSuccess     The function which is executed on success. 
	 * @param {Function} onError       The function which is executed on error. 
	 */
	function useHttp(params, onSuccess, onError){
		$http({
			method: 'GET',
			url: 'app/backend/view/bookview.php',
			params: params
		}).then(onSuccess, onError);
	}	
});