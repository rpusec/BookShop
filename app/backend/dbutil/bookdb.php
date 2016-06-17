<?php

require_once('basedb.php');

class BookDB extends BaseDB
{
	public static function getBooks($currentPage, $perPage){
		$copiesQuery = "SELECT count(*) FROM book_copy WHERE book_copy.book_id = targetBookID";
		$query = 	"SELECT book.book_id as targetBookID, title, author, description, price, ($copiesQuery) as copies FROM book LIMIT ? OFFSET ?";
		
		$stmt = parent::getConn()->prepare($query);

		if(!$stmt)
		{
			echo parent::getConn()->error;
			exit();
		}

		$offset = ($currentPage-1)*$perPage;
		$stmt->bind_param('ii', $perPage, $offset);
		$stmt->execute();
		$stmt->bind_result($bookID, $title, $author, $description, $price, $copies);
		$result = array();
		while($stmt->fetch())
		{
			$result[] = array(
				'book_id' => $bookID,
				'title' => $title,
				'author' => $author,
				'description' => $description,
				'price' => $price,
				'copies' => $copies);
		}
		return $result;
	}

	public static function countBookAmount(){
		$result = parent::presentRSAsArray(parent::getConn()->query('SELECT count(*) as bookCount FROM book'));
		return $result[0]['bookCount'];
	}

	public static function getAnAvailableBookCopy($bookID){
		parent::startConn();
		$stmt = parent::getConn()->prepare('SELECT book_copy_id FROM book_copy WHERE book_id=? AND user_id IS NULL LIMIT 1');
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

	public static function addBookCopyToCart($availableBookCopyID, $userID){
		parent::startConn();
		$stmt = parent::getConn()->prepare('UPDATE book_copy SET user_id = ? WHERE book_copy_id = ?');
		$stmt->bind_param("ii", $userID, $availableBookCopyID);
		$stmt->execute();
		$stmt->close();
		parent::closeConn();
		return $stmt->affected_rows === 1;
	}

	public static function removeBookCopyFromCart($bookCopyID, $userID){
		parent::startConn();
		$stmt = parent::getConn()->prepare('UPDATE book_copy SET user_id = null WHERE book_copy_id = ? AND user_id = ?');
		$stmt->bind_param("ii", $bookCopyID, $userID);
		$stmt->execute();
		$stmt->close();
		parent::closeConn();
		return $stmt->affected_rows === 1;
	}

	public static function addBook($title, $author, $description, $price){
		return parent::addEntity(array(
			'title' => $title,
			'author' => $author,
			'description' => $description,
			'price' => $price,
		), 'book', 'sssi');
	}

	public static function editBook($bookID, $updateArr){
		return parent::editEntity($bookID, $updateArr, 'book', 'book_id');
	}

	public static function deleteBook($bookID){
		return parent::deleteEntity($bookID, 'book', 'book_id');
	}
}