<?php

require_once('../dbutil/bookdb.php');
require_once('../config/appconfig.php');
require_once('../logic/authbusiness.php');

class BookContr {

	public function getBooks($currentPage, $perPage){
		if(!AuthBusiness::isAuthenticated())
			return array('authenticated' => false, 'message' => AUTHENTICATION_ERROR);

		BookDB::startConn();
		$books = BookDB::getBooks($currentPage, $perPage);
		$bookCount = BookDB::countBookAmount();
		return array(
			'authenticated' => true, 
			'books' => $books, 
			'bookCount' => $bookCount);
	}

	public function addBook($title, $author, $description, $price){
		if(!AuthBusiness::isAuthenticated())
			return array('authenticated' => false, 'message' => AUTHENTICATION_ERROR);

		BookDB::startConn();
		return array(
			'authenticated' => true, 
			'message' => 'Book added. ',
			'bookAdded' => BookDB::addBook($title, $author, $description, $price));
	}

	public function editBook($bookID, $title, $author, $description, $price){
		if(!AuthBusiness::isAuthenticated())
			return array('authenticated' => false, 'message' => AUTHENTICATION_ERROR);

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
			'authenticated' => true, 
			'message' => 'Book edited. ',
			'bookEdited' => BookDB::editBook($bookID, $updateArr));
	}

	public function deleteBook($bookID){
		if(!AuthBusiness::isAuthenticated())
			return array('authenticated' => false, 'message' => AUTHENTICATION_ERROR);

		BookDB::startConn();
		return array(
			'authenticated' => true, 
			'message' => 'Book deleted. ',
			'bookRemoved' => BookDB::deleteBook($bookID));
	}

	public static function getBookCopies($bookID, $currentPage, $perPage){
		if(!AuthBusiness::isAuthenticated())
			return array('authenticated' => false, 'message' => AUTHENTICATION_ERROR);

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

		BookDB::startConn();
		return array(
			'authenticated' => true, 
			'message' => 'Book copies added. ',
			'bookCopiesAdded' => BookDB::addBookCopies($bookID, $copyAmount));
	}

	public static function removeBookCopies($strBookCopyIDs){
		if(!AuthBusiness::isAuthenticated())
			return array('authenticated' => false, 'message' => AUTHENTICATION_ERROR);

		BookDB::startConn();
		$arrBookCopyIDs = array_map('intval', explode('|', $strBookCopyIDs));
		return array(
			'authenticated' => true, 
			'message' => 'Book copies removed. ',
			'bookCopiesRemoved' => BookDB::removeBookCopies($arrBookCopyIDs));	
	}

	public function getCatalogue($currentPage, $perPage){
		if(!AuthBusiness::isAuthenticated())
			return array('authenticated' => false, 'message' => AUTHENTICATION_ERROR);

		BookDB::startConn();
		$books = BookDB::getBooksWithAvailableCopyAmount($currentPage, $perPage);
		$bookCount = BookDB::countBookAmount();
		return array(
			'authenticated' => true,
			'books' => $books,
			'bookCount' => $bookCount);
	}

	public function addBookToCart($bookID){
		if(!AuthBusiness::isAuthenticated())
			return array('authenticated' => false, 'message' => AUTHENTICATION_ERROR);

		BookDB::startConn();
		$availableBookCopyID = BookDB::getAnAvailableBookCopy($bookID);
		$success = BookDB::addBookCopyToCart($availableBookCopyID, AuthBusiness::getUser());
		return array(
			'authenticated' => true, 
			'message' => 'Book added to cart. ',
			'bookAddedToCart' => $success);
	}

	public function removeBookFromCart($bookCopyID){
		if(!AuthBusiness::isAuthenticated())
			return array('authenticated' => false, 'message' => AUTHENTICATION_ERROR);

		BookDB::startConn();
		$success = BookDB::removeBookCopyFromCart($bookCopyID, AuthBusiness::getUser());
		return array(
			'authenticated' => true, 
			'message' => 'Book removed from cart. ',
			'bookRemovedFromCart' => $success);
	}

}