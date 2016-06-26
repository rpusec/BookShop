<?php 

require_once('basedb.php');

class UserDB extends BaseDB
{
	public static function getUser($userID){
		$stmt = parent::getConn()->prepare('SELECT fname, lname, username, password, amount, is_admin FROM user WHERE user_id=?');
		$stmt->bind_param("i", $userID);
		$stmt->execute();
		$stmt->bind_result($fname, $lname, $username, $password, $amount, $is_admin);
		$userFound = $stmt->fetch();
		$stmt->close();

		if(!$userFound)
			return null;
		return array(
			'userID' => $userID, 
			'fname' => $fname,
			'lname' => $lname,
			'username' => $username,
			'password' => $password,
			'amount' => $amount,
			'is_admin' => $is_admin
		);
	}

	public static function getUserByUsernameAndPassword($username, $password){
		$stmt = parent::getConn()->prepare('SELECT user_id, fname, lname, username, password, amount, is_admin FROM user WHERE username=? AND password=?');
		$stmt->bind_param("ss", $username, $password);
		$stmt->execute();
		$stmt->bind_result($userID, $fname, $lname, $username, $password, $amount, $is_admin);
		$userFound = $stmt->fetch();
		$stmt->close();
		
		if(!$userFound)
			return null;
		return array(
			'userID' => $userID,
			'fname' => $fname,
			'lname' => $lname,
			'username' => $username,
			'password' => $password,
			'amount' => $amount,
			'is_admin' => $is_admin
		);
	}

	public static function getUsers($currentPage, $perPage){
		$stmt = parent::getConn()->prepare('SELECT user_id, fname, lname, username, password, amount, is_admin FROM user LIMIT ? OFFSET ?');
		$offset = ($currentPage-1)*$perPage;
		$stmt->bind_param('ii', $perPage, $offset);
		$stmt->execute();
		$stmt->bind_result($userID, $fname, $lname, $username, $password, $amount, $is_admin);
		$result = array();
		while($stmt->fetch())
		{
			$result[] = array(
				'user_id' => $userID,
				'fname' => $fname,
				'lname' => $lname,
				'username' => $username,
				'password' => $password,
				'amount' => $amount,
				'is_admin' => $is_admin
			);
		}
		return $result;
	}

	public static function getUserCount(){
		$result = parent::presentRSAsArray(parent::getConn()->query('SELECT count(user_id) as userCount FROM user'));
		return $result[0]['userCount'];
	}

	public static function addUser($fname, $lname, $username, $password, $amount, $is_admin){
		return parent::addEntity(array(
			'fname' => $fname,
			'lname' => $lname,
			'username' => $username,
			'password' => $password,
			'amount' => $amount,
			'is_admin' => $is_admin
		), 'user', 'ssssii');
	}

	public static function editUser($userID, $updateArr){
		return parent::editEntity($userID, $updateArr, 'user', 'user_id');
	}

	public static function deleteUser($userID){
		return parent::deleteEntity($userID, 'user', 'user_id');
	}
}