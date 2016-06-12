<?php

class BookContr {

	public function getBooks(){
		$books = BookDB::getBooks();
		$resultCount = BookDB::countBookAmount();
		return array('books' => $books, 'resultCount' => $resultCount);
	}

	public function addBook($title, $author, $description, $price){
		return array('bookAdded' => BookDB::addBook($title, $author, $description, $price));
	}

	public function editBook($bookID, $title, $author, $description, $price){
		return array('bookEdited' => BookDB::addBook($bookID, $title, $author, $description, $price));
	}

	public function removeBook($bookID){
		return array('bookRemoved' => BookDB::removeBook($bookID));
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