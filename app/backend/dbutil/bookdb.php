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
		$stmt->close();
		return $result;
	}

	public static function countBookAmount(){
		$result = parent::presentRSAsArray(parent::getConn()->query('SELECT count(*) as bookCount FROM book'));
		return $result[0]['bookCount'];
	}

	public static function getAnAvailableBookCopy($bookID){
		$stmt = parent::getConn()->prepare('SELECT book_copy_id FROM book_copy WHERE book_id=? AND user_id IS NULL LIMIT 1');
		$stmt->bind_param("i", $bookID);
		$stmt->execute();
		$stmt->bind_result($bookCopyID);
		$bookFound = $stmt->fetch();
		$stmt->close();
		
		if(!$bookFound)
			return null;
		return $bookCopyID;
	}

	public static function addBookCopyToCart($availableBookCopyID, $userID){
		$stmt = parent::getConn()->prepare('UPDATE book_copy SET user_id = ? WHERE book_copy_id = ?');
		$stmt->bind_param("ii", $userID, $availableBookCopyID);
		$stmt->execute();
		$stmt->close();
		return $stmt->affected_rows === 1;
	}

	public static function removeBookCopyFromCart($bookCopyID, $userID){
		$stmt = parent::getConn()->prepare('UPDATE book_copy SET user_id = null WHERE book_copy_id = ? AND user_id = ?');
		$stmt->bind_param("ii", $bookCopyID, $userID);
		$stmt->execute();
		$stmt->close();
		return $stmt->affected_rows === 1;
	}

	public static function addBookCopies($bookID, $copyAmount){
		$query = 'INSERT INTO book_copy (book_id) VALUES (?)';
		$values = array();
		$bindStr = "";

		for($i = 0; $i < $copyAmount; $i++)
		{
			$query .= ', (?)';
			$values[] = &$bookID;
			$bindStr .= 'i';
		}

		array_unshift($values, $bindStr);
		$stmt = parent::getConn()->prepare($query);
		call_user_func_array(array($stmt, "bind_param"), $values);
		$stmt->execute();
		$ar = $stmt->affected_rows;
		$stmt->close();
		return $ar;
	}

	public static function getBookCopies($bookID){
		$query = 'SELECT book_copy_id, book_id, fname, lname FROM book_copy LEFT JOIN user ON (book_copy.user_id = user.user_id) WHERE book_id = ?';
		$stmt = parent::getConn()->prepare($query);
		$stmt->bind_param("i", $bookID);
		$stmt->execute();
		$stmt->bind_result($bookCopyID, $bookID, $fname, $lname);
		$result = array();
		while($stmt->fetch())
		{
			$result[] = array(
				'book_copy_id' => $bookCopyID,
				'book_id' => $bookID,
				'fname' => $fname,
				'lname' => $lname);
		}
		$stmt->close();
		return $result;
	}

	public static function removeBookCopies($arrBookCopyIDs){
		$query = 'DELETE FROM book_copy WHERE ';
		$values = array();
		$bindStr = "";

		foreach($arrBookCopyIDs as $bookCopyKey => $bookCopyVal){
			$query .= 'book_copy_id = ?';

			if($bookCopyKey !== count($arrBookCopyIDs)-1)
				$query .= ' OR ';

			$values[] = &$bookCopyVal;
			$bindStr .= 'i';
		}

		array_unshift($values, $bindStr);
		$stmt = parent::getConn()->prepare($query);
		call_user_func_array(array($stmt, "bind_param"), $values);
		$stmt->execute();
		$ar = $stmt->affected_rows;
		$stmt->close();
		return $ar;
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