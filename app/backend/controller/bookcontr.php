<?php

require_once('../dbutil/bookdb.php');
require_once('../config/appconfig.php');
require_once('../logic/bookbusiness.php');
require_once('../logic/authbusiness.php');
require_once('../validation/ValidationHelper.class.php');

class BookContr {

	public function getBooks($currentPage, $perPage, $searchBy, $filter){
		if(!AuthBusiness::isAuthenticated())
			return array('authenticated' => false, 'message' => AUTHENTICATION_ERROR);

		if(!AuthBusiness::isAdmin())
			return array('authenticated' => false, 'message' => INSUFFICIENT_PRIVILEGE);
		
		BookDB::startConn();
		$books = BookDB::getBooks($currentPage, $perPage, $searchBy, $filter);
		$bookCount = BookDB::countBookAmount($searchBy, $filter);
		return array(
			'authenticated' => true, 
			'books' => $books, 
			'bookCount' => $bookCount);
	}

	public function addBook($title, $author, $description, $price){
		if(!AuthBusiness::isAuthenticated())
			return array('authenticated' => false, 'message' => AUTHENTICATION_ERROR);

		if(!AuthBusiness::isAdmin())
			return array('authenticated' => false, 'message' => INSUFFICIENT_PRIVILEGE);

		ValidationHelper::validateInput($title, 'alphaNumericSpace', BOOK_TITLE_ERROR, 'title');
		ValidationHelper::validateInput($author, 'alphabeticSpace', AUTHOR_NAME_ERROR, 'author');
		ValidationHelper::validateInput($description, 'alphabeticNumericPunct', DESCR_ERROR, 'description');
		ValidationHelper::validateInput($price, 'numeric', PRICE_ERROR, 'price');

		ValidationHelper::checkAppropriateInputLength($title, TITLE_LENGTH_FROM, TITLE_LENGTH_TO, 'title', 'title');
		ValidationHelper::checkAppropriateInputLength($author, AUTHOR_LENGTH_FROM, AUTHOR_LENGTH_TO, 'author', 'author');
		ValidationHelper::checkAppropriateInputLength($description, DESCR_LENGTH_FROM, DESCR_LENGTH_TO, 'description', 'description');
		ValidationHelper::checkAppropriateInputLength($price, PRICE_LENGTH_FROM, PRICE_LENGTH_TO, 'price', 'price');

		if(ValidationHelper::hasErrors())
			return array('authenticated' => true, 'hasErrors' => true, 'errors' => ValidationHelper::getErrors());

		BookDB::startConn();
		return array(
			'hasErrors' => false,
			'authenticated' => true, 
			'message' => 'Book added. ',
			'bookAdded' => BookDB::addBook($title, $author, $description, $price));
	}

	public function editBook($bookID, $title, $author, $description, $price){
		if(!AuthBusiness::isAuthenticated())
			return array('authenticated' => false, 'message' => AUTHENTICATION_ERROR);

		if(!AuthBusiness::isAdmin())
			return array('authenticated' => false, 'message' => INSUFFICIENT_PRIVILEGE);

		if($title !== '')
		{
			ValidationHelper::validateInput($title, 'alphaNumericSpace', BOOK_TITLE_ERROR, 'title');
			ValidationHelper::checkAppropriateInputLength($title, TITLE_LENGTH_FROM, TITLE_LENGTH_TO, 'title', 'title');
		}
		
		if($author !== '')
		{
			ValidationHelper::validateInput($author, 'alphabeticSpace', AUTHOR_NAME_ERROR, 'author');
			ValidationHelper::checkAppropriateInputLength($author, AUTHOR_LENGTH_FROM, AUTHOR_LENGTH_TO, 'author', 'author');
		}
		
		if($description !== '')
		{
			ValidationHelper::validateInput($description, 'alphabeticNumericPunct', DESCR_ERROR, 'description');
			ValidationHelper::checkAppropriateInputLength($description, DESCR_LENGTH_FROM, DESCR_LENGTH_TO, 'description', 'description');
		}
		
		if($price !== '')
		{
			ValidationHelper::validateInput($price, 'numeric', PRICE_ERROR, 'price');
			ValidationHelper::checkAppropriateInputLength($price, PRICE_LENGTH_FROM, PRICE_LENGTH_TO, 'price', 'price');
		}

		if($title == '' && $author == '' && $description == '' && $price == '')
			ValidationHelper::addError('Please change at least one input. ', 'none');

		if(ValidationHelper::hasErrors())
			return array('authenticated' => true, 'hasErrors' => true, 'errors' => ValidationHelper::getErrors());

		$updateArr = array();
		
		if($title !== '')
			$updateArr['title'] = array('value' => $title, 'type' => 's');

		if($author !== '')
			$updateArr['author'] = array('value' => $author, 'type' => 's');

		if($description !== '')
			$updateArr['description'] = array('value' => $description, 'type' => 's');

		if($price !== '')
			$updateArr['price'] = array('value' => $price, 'type' => 'i');

		BookDB::startConn();
		return array(
			'hasErrors' => false,
			'authenticated' => true, 
			'message' => 'Book edited. ',
			'bookEdited' => BookDB::editBook($bookID, $updateArr));
	}

	public function deleteBook($bookID){
		if(!AuthBusiness::isAuthenticated())
			return array('authenticated' => false, 'message' => AUTHENTICATION_ERROR);

		if(!AuthBusiness::isAdmin())
			return array('authenticated' => false, 'message' => INSUFFICIENT_PRIVILEGE);

		BookDB::startConn();
		return array(
			'authenticated' => true, 
			'message' => 'Book deleted. ',
			'bookRemoved' => BookDB::deleteBook($bookID));
	}

	public static function getBookCopies($bookID, $currentPage, $perPage){
		if(!AuthBusiness::isAuthenticated())
			return array('authenticated' => false, 'message' => AUTHENTICATION_ERROR);

		if(!AuthBusiness::isAdmin())
			return array('authenticated' => false, 'message' => INSUFFICIENT_PRIVILEGE);

		BookDB::startConn();
		$bookCopies = BookDB::getBookCopies($bookID, $currentPage, $perPage);
		$bookCopiesCount = BookDB::countBookCopyAmount($bookID);
		return array(
			'authenticated' => true, 
			'bookCopies' => $bookCopies,
			'bookCopyCount' => $bookCopiesCount);
	}

	public static function addBookCopies($bookID, $copyAmount){
		if(!AuthBusiness::isAuthenticated())
			return array('authenticated' => false, 'message' => AUTHENTICATION_ERROR);

		if(!AuthBusiness::isAdmin())
			return array('authenticated' => false, 'message' => INSUFFICIENT_PRIVILEGE);

		ValidationHelper::validateInput($copyAmount, 'integer', COPY_AMOUNT_ERROR, 'bookcopy');
		ValidationHelper::checkAppropriateInputLength($copyAmount, COPY_AMOUNT_FROM, COPY_AMOUNT_TO, 'book copy', 'bookcopy');

		if(ValidationHelper::hasErrors())
			return array('authenticated' => true, 'hasErrors' => true, 'errors' => ValidationHelper::getErrors());

		BookDB::startConn();
		return array(
			'hasErrors' => false,
			'authenticated' => true, 
			'message' => 'Book copies added. ',
			'bookCopiesAdded' => BookDB::addBookCopies($bookID, $copyAmount));
	}

	public static function removeBookCopies($strBookCopyIDs){
		if(!AuthBusiness::isAuthenticated())
			return array('authenticated' => false, 'message' => AUTHENTICATION_ERROR);

		if(!AuthBusiness::isAdmin())
			return array('authenticated' => false, 'message' => INSUFFICIENT_PRIVILEGE);

		BookDB::startConn();
		$arrBookCopyIDs = array_map('intval', explode('|', $strBookCopyIDs));
		return array(
			'authenticated' => true, 
			'message' => 'Book copies removed. ',
			'bookCopiesRemoved' => BookDB::removeBookCopies($arrBookCopyIDs));	
	}

	public function getCatalogue($currentPage, $perPage, $searchBy, $filter){
		if(!AuthBusiness::isAuthenticated())
			return array('authenticated' => false, 'message' => AUTHENTICATION_ERROR);

		BookDB::startConn();
		$books = BookDB::getBooksWithAvailableCopyAmount($currentPage, $perPage, $searchBy, $filter);
		$bookCount = BookDB::countBookAmount($searchBy, $filter);
		$balance = BookBusiness::calcUserBookBalance(AuthBusiness::getUser());
		return array(
			'authenticated' => true,
			'books' => $books,
			'bookCount' => $bookCount,
			'balance' => $balance);
	}

	public function getBooksFromCart($currentPage, $perPage, $searchBy, $filter){
		if(!AuthBusiness::isAuthenticated())
			return array('authenticated' => false, 'message' => AUTHENTICATION_ERROR);

		BookDB::startConn();
		$books = BookDB::getBooksFromCart($currentPage, $perPage, AuthBusiness::getUser(), $searchBy, $filter);
		$bookCount = BookDB::countBooksFromCart(AuthBusiness::getUser(), $searchBy, $filter);
		$balance = BookBusiness::calcUserBookBalance(AuthBusiness::getUser());
		return array(
			'authenticated' => true,
			'books' => $books,
			'bookCount' => $bookCount,
			'balance' => $balance);
	}

	public function addBookToCart($bookID){
		if(!AuthBusiness::isAuthenticated())
			return array('authenticated' => false, 'message' => AUTHENTICATION_ERROR);

		BookDB::startConn();
		
		if(BookBusiness::isUserAbleToAfford(AuthBusiness::getUser(), $bookID))
		{
			$availableBookCopyID = BookDB::getAnAvailableBookCopy($bookID);
			$success = BookDB::addBookCopyToCart($availableBookCopyID, AuthBusiness::getUser());
		}
		else
			return array(
				'authenticated' => true,
				'canAfford' => false,
				'message' => 'Can\'t afford the book. ');

		return array(
			'authenticated' => true, 
			'canAfford' => true,
			'message' => $success ? 'Book added to cart. ' : 'No copies left anymore. ',
			'bookAddedToCart' => $success);
	}

	public function removeBookFromCart($bookID){
		if(!AuthBusiness::isAuthenticated())
			return array('authenticated' => false, 'message' => AUTHENTICATION_ERROR);

		BookDB::startConn();
		$bookCopyFromUserID = BookDB::getABookCopyFromUser($bookID, AuthBusiness::getUser());
		$success = BookDB::removeBookCopyFromCart($bookCopyFromUserID, AuthBusiness::getUser());
		return array(
			'authenticated' => true, 
			'message' => 'Book removed from cart. ',
			'bookRemovedFromCart' => $success);
	}

}