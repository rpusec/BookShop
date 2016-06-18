<?php

require_once('../dbutil/bookdb.php');

class BookContr {

	public function getBooks($currentPage, $perPage){
		BookDB::startConn();
		$books = BookDB::getBooks($currentPage, $perPage);
		$bookCount = BookDB::countBookAmount();
		return array('books' => $books, 'bookCount' => $bookCount);
	}

	public function addBook($title, $author, $description, $price){
		BookDB::startConn();
		return array('bookAdded' => BookDB::addBook($title, $author, $description, $price));
	}

	public function editBook($bookID, $title, $author, $description, $price){
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
		return array('bookEdited' => BookDB::editBook($bookID, $updateArr));
	}

	public function deleteBook($bookID){
		BookDB::startConn();
		return array('bookRemoved' => BookDB::deleteBook($bookID));
	}

	public static function getBookCopies($bookID){
		BookDB::startConn();
		return array('bookCopies' => BookDB::getBookCopies($bookID));
	}

	public static function addBookCopies($bookID, $copyAmount){
		BookDB::startConn();
		return array('bookCopiesAdded' => BookDB::addBookCopies($bookID, $copyAmount));
	}

	public static function removeBookCopies($arrBookCopyIDs){
		BookDB::startConn();
		return array('bookCopiesRemoved' => BookDB::removeBookCopies($arrBookCopyIDs));	
	}

	public function addBookToCart($bookID){
		BookDB::startConn();
		$availableBookCopyID = BookDB::getAnAvailableBookCopy($bookID);
		$success = BookDB::addBookCopyToCart($availableBookCopyID, $_SESSION['userID']);
		return array('bookAddedToCart' => $success);
	}

	public function removeBookFromCart($bookCopyID){
		BookDB::startConn();
		$success = BookDB::removeBookCopyFromCart($bookCopyID, $_SESSION['userID']);
		return array('bookRemovedFromCart' => $success);
	}

}