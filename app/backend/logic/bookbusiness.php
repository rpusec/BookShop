<?php

require_once('../dbutil/bookdb.php');
require_once('../dbutil/userdb.php');

class BookBusiness{

	public static function calcUserBookBalance($userID){
		$user = UserDB::getUser($userID);
		$balance = $user['amount'];
		$booksFromCart = BookDB::getBooksFromCart(null, null, $userID);

		$spentCash = 0;

		foreach($booksFromCart as $book)
			$spentCash += $book['price'] * $book['copiesInCart'];

		return $balance - $spentCash;
	}

}