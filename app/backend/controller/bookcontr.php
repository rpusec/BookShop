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
		$updateArr = new Array();
		
		if($title !== '')
			$updateArr['title'] = array('value' => $title, 'type' => 's');

		if($author !== '')
			$updateArr['author'] = array('value' => $author, 'type' => 's');

		if($description !== '')
			$updateArr['description'] = array('value' => $description, 'type' => 's');

		if($price !== '')
			$updateArr['price'] = array('value' => $price, 'type' => 'i');

		return array('bookEdited' => BookDB::editBook($bookID, $updateArr));
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