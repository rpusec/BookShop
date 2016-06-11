<?php

require_once('basedb.php');

class BookDB extends BaseDB
{
	public function getBooks(){
		parent::startConn();
		$amountQuery = "SELECT count(*) FROM book_copy WHERE book_copy.book_id = book_id";
		$query = 	"SELECT book_id, title, author, description, cost, ($amountQuery) as amount FROM book " . 
					"JOIN book_copy ON (book.book_id = book_copy.book_id)";
		$result = parent::presentRSAsArray((parent::getConn())->query($query));
		parent::closeConn();
		return $result;
	}

	public function countBookAmount(){
		parent::startConn();
		$result = parent::presentRSAsArray((parent::getConn())->query('SELECT count(*) FROM book'));
		parent::closeConn();
		return $result;
	}

	public function getAnAvailableBookCopy($bookID){
		parent::startConn();
		$stmt = (parent::getConn())->prepare('SELECT book_copy_id FROM book_copy WHERE book_id=? AND user_id IS NULL LIMIT 1');
		$stmt->bind_param("i", $bookID);
		$stmt->execute();
		$stmt->bind_result($bookCopyID);
		$bookFound = $stmt->fetch();
		$stmt->close();
		parent::closeConn();
		
		if(!$bookFound)
			return null;
		return $bookCopyID;
	}

	public function addBookCopyToCart($availableBookCopyID, $userID){
		parent::startConn();
		$stmt = (parent::getConn())->prepare('UPDATE book_copy SET user_id = ? WHERE book_copy_id = ?');
		$stmt->bind_param("ii", $userID, $availableBookCopyID);
		$stmt->execute();
		$stmt->close();
		parent::closeConn();
		return $stmt->affected_rows === 1;
	}

	public function removeBookCopyFromCart($bookCopyID, $userID){
		parent::startConn();
		$stmt = (parent::getConn())->prepare('UPDATE book_copy SET user_id = null WHERE book_copy_id = ? AND user_id = ?');
		$stmt->bind_param("ii", $bookCopyID, $userID);
		$stmt->execute();
		$stmt->close();
		parent::closeConn();
		return $stmt->affected_rows === 1;
	}
}