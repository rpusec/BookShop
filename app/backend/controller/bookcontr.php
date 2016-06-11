<?php

class BookContr {

	public function getBooks(){
		$books = BookDB::getBooks();
		$resultCount = BookDB::countBookAmount();
		return array('books' => $books, 'resultCount' => $resultCount);
	}

	public function addBookToCart($bookID){
		$availableBookCopyID = BookDB::getAnAvailableBookCopy($bookID);
		$success = BookDB::addBookCopyToCart($availableBookCopyID, $_SESSION['userID']);
		return array('bookAddedToCart' => $success);
	}

	public function removeBookFromCart($bookCopyID){
		$success = BookDB::removeBookCopyFromCart($bookCopyID, $_SESSION['userID']);
		return array('bookRemovedFromCart' => $success);
	}

}