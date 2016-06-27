<?php

require_once('basedb.php');

class BookDB extends BaseDB
{
	public static function getBooks($currentPage, $perPage, $searchBy, $filter){
		$copiesQuery = "SELECT count(*) FROM book_copy WHERE book_copy.book_id = targetBookID";
		$query = 	"SELECT book.book_id as targetBookID, title, author, description, price, ($copiesQuery) as copies FROM book ";
		if($searchBy !== null && $filter !== null)
			$query .= "WHERE $filter LIKE ? ";
		$query .= 'LIMIT ? OFFSET ?';
		
		$stmt = parent::getConn()->prepare($query);
		$offset = ($currentPage-1)*$perPage;

		if($searchBy !== null && $filter !== null)
		{
			$searchBy = "%{$searchBy}%";
			$stmt->bind_param('sii', $searchBy, $perPage, $offset);
		}
		else
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

	public static function getBook($bookID){
		$stmt = parent::getConn()->prepare("SELECT title, author, description, price FROM book WHERE book_id = ?");
		$stmt->bind_param("i", $bookID);
		$stmt->execute();
		$stmt->bind_result($title, $author, $description, $price);
		$bookFound = $stmt->fetch();
		$stmt->close();
		
		if(!$bookFound)
			return null;
		return array(
			'book_id' => $bookID,
			'title' => $title,
			'author' => $author,
			'description' => $description,
			'price' => $price);
	}

	public static function countBookAmount($searchBy, $filter){
		$query = "SELECT count(*) as bookCount FROM book ";
		if($searchBy !== null && $filter !== null)
			$query .= "WHERE $filter LIKE ? ";

		$stmt = parent::getConn()->prepare($query);

		if($searchBy !== null && $filter !== null)
		{
			$searchBy = "%{$searchBy}%";
			$stmt->bind_param('s', $searchBy);
		}

		$stmt->execute();
		$stmt->bind_result($count);
		$stmt->fetch();
		return $count;
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

	public static function getABookCopyFromUser($bookID, $userID){
		$stmt = parent::getConn()->prepare('SELECT book_copy_id FROM book_copy WHERE book_id=? AND user_id=? LIMIT 1');
		$stmt->bind_param("ii", $bookID, $userID);
		$stmt->execute();
		$stmt->bind_result($bookCopyID);
		$bookFound = $stmt->fetch();
		$stmt->close();
		
		if(!$bookFound)
			return null;
		return $bookCopyID;
	}

	public static function getBooksFromCart($currentPage=null, $perPage=null, $userID, $searchBy=null, $filter=null){
		$innerQuery = "SELECT count(*) FROM book_copy WHERE book_copy.user_id = ? AND book_copy.book_id = book.book_id";
		$query = "SELECT book_id, title, author, description, price, ($innerQuery) as copiesInCart FROM book ";
		if($searchBy !== null && $filter !== null)
			$query .= "WHERE $filter LIKE ? ";

		$query .= " HAVING copiesInCart > 0 ";
		
		if($currentPage !== null && $perPage !== null)
			$query .= 'LIMIT ? OFFSET ?';

		$stmt = parent::getConn()->prepare($query);

		if($searchBy !== null && $filter !== null && $currentPage !== null && $perPage !== null)
		{
			$offset = ($currentPage-1)*$perPage;
			$searchBy = "%{$searchBy}%";
			$stmt->bind_param("isii", $userID, $searchBy, $perPage, $offset);
		}
		else if($currentPage !== null && $perPage !== null)
		{
			$offset = ($currentPage-1)*$perPage;
			$stmt->bind_param("iii", $userID, $perPage, $offset);
		}
		else
			$stmt->bind_param("i", $userID);

		$stmt->execute();
		$stmt->bind_result($bookID, $title, $author, $description, $price, $copiesInCart);
		$result = array();
		while($stmt->fetch())
		{
			$result[] = array(
				'book_id' => $bookID,
				'title' => $title,
				'author' => $author,
				'description' => $description,
				'price' => $price,
				'copiesInCart' => $copiesInCart);
		}

		$stmt->close();
		return $result;
	}

	public static function addBookCopyToCart($availableBookCopyID, $userID){
		$stmt = parent::getConn()->prepare('UPDATE book_copy SET user_id = ? WHERE book_copy_id = ?');
		$stmt->bind_param("ii", $userID, $availableBookCopyID);
		$stmt->execute();
		$ar = $stmt->affected_rows === 1;
		$stmt->close();
		return $ar;
	}

	public static function removeBookCopyFromCart($bookCopyID, $userID){
		$stmt = parent::getConn()->prepare('UPDATE book_copy SET user_id = null WHERE book_copy_id = ? AND user_id = ?');
		$stmt->bind_param("ii", $bookCopyID, $userID);
		$stmt->execute();
		$ar = $stmt->affected_rows === 1;
		$stmt->close();
		return $ar;
	}

	public static function countBooksFromCart($userID, $searchBy, $filter){
		$query = 'SELECT count(DISTINCT book_copy.book_id) as count FROM book_copy JOIN book ON (book.book_id = book_copy.book_id) WHERE user_id = ? ';
		if($searchBy !== null && $filter !== null)
			$query .= "AND $filter LIKE ? ";

		$stmt = parent::getConn()->prepare($query);

		if($searchBy !== null && $filter !== null)
		{
			$searchBy = "%{$searchBy}%";
			$stmt->bind_param("is", $userID, $searchBy);
		}
		else
			$stmt->bind_param("i", $userID);
		
		$stmt->execute();
		$stmt->bind_result($bookCopyCount);
		$bookCopyFound = $stmt->fetch();
		$stmt->close();
		
		if(!$bookCopyFound)
			return null;
		return $bookCopyCount;
	}

	public static function addBookCopies($bookID, $copyAmount){
		$query = 'INSERT INTO book_copy (book_id) VALUES ';
		$values = array();
		$bindStr = "";

		for($i = 0; $i < $copyAmount; $i++)
		{
			$query .= '(?)';
			$values[] = &$bookID;
			$bindStr .= 'i';

			if($i !== $copyAmount-1)
				$query .= ',';
		}

		array_unshift($values, $bindStr);
		$stmt = parent::getConn()->prepare($query);
		call_user_func_array(array($stmt, "bind_param"), $values);
		$stmt->execute();
		$ar = $stmt->affected_rows;
		$stmt->close();
		return $ar;
	}

	public static function getBookCopies($bookID, $currentPage, $perPage){ 
		$query = 'SELECT book_copy_id, fname, lname FROM book_copy LEFT JOIN user ON (book_copy.user_id = user.user_id) WHERE book_id = ? LIMIT ? OFFSET ?';
		$stmt = parent::getConn()->prepare($query);
		$offset = ($currentPage-1)*$perPage;
		$stmt->bind_param("iii", $bookID, $perPage, $offset);
		$stmt->execute();
		$stmt->bind_result($bookCopyID, $fname, $lname);
		$result = array();
		while($stmt->fetch())
		{
			$result[] = array(
				'book_copy_id' => $bookCopyID,
				'fname' => $fname,
				'lname' => $lname);
		}

		$stmt->close();
		return $result;
	}

	public static function countBookCopyAmount($bookID){
		$stmt = parent::getConn()->prepare('SELECT count(*) as bookCopyCount FROM book_copy WHERE book_id = ?');
		$stmt->bind_param("i", $bookID);
		$stmt->execute();
		$stmt->bind_result($bookCopyCount);
		$bookCopyFound = $stmt->fetch();
		$stmt->close();
		
		if(!$bookCopyFound)
			return null;
		return $bookCopyCount;
	}

	public static function removeBookCopies($arrBookCopyIDs){
		$query = 'DELETE FROM book_copy WHERE ';
		$values = array();
		$bindStr = "";

		foreach($arrBookCopyIDs as $bookCopyKey => $bookCopyVal){
			$query .= 'book_copy_id = ?';

			if($bookCopyKey !== count($arrBookCopyIDs)-1)
				$query .= ' OR ';

			$values[] = &$arrBookCopyIDs[$bookCopyKey];
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
		$stmt = parent::getConn()->prepare('DELETE FROM book_copy WHERE book_id = ?');
		$stmt->bind_param("i", $bookID);
		$stmt->execute();
		$stmt->close();
		return parent::deleteEntity($bookID, 'book', 'book_id');
	}

	public static function getBooksWithAvailableCopyAmount($currentPage, $perPage, $searchBy, $filter){
		$subQuery = "SELECT count(*) FROM book_copy WHERE book_copy.user_id IS NULL AND book_copy.book_id = book.book_id";
		$query = "SELECT book_id, title, author, description, price, ($subQuery) as availCopyNum FROM book ";
		if($searchBy !== null && $filter !== null)
			$query .= "WHERE $filter LIKE ? ";
		$query .= 'LIMIT ? OFFSET ?';

		$stmt = parent::getConn()->prepare($query);
		$offset = ($currentPage-1)*$perPage;

		if($searchBy !== null && $filter !== null)
		{
			$searchBy = "%{$searchBy}%";
			$stmt->bind_param('sii', $searchBy, $perPage, $offset);
		}
		else
			$stmt->bind_param('ii', $perPage, $offset);

		$stmt->execute();
		$stmt->bind_result($bookID, $title, $author, $description, $price, $availCopyNum);
		$result = array();
		while($stmt->fetch())
		{
			$result[] = array(
				'book_id' => $bookID,
				'title' => $title,
				'author' => $author,
				'description' => $description,
				'price' => $price,
				'availCopyNum' => $availCopyNum);
		}
		$stmt->close();
		return $result;
	}
}