<?php 

require_once('basedb.php');

class UserDB extends BaseDB
{
	public static function getUser($userID){
		parent::startConn();
		$stmt = parent::getConn()->prepare('SELECT fname, lname, username, password, amount FROM user WHERE user_id=?');
		$stmt->bind_param("i", $userID);
		$stmt->execute();
		$stmt->bind_result($fname, $lname, $username, $password, $amount);
		$userFound = $stmt->fetch();
		$stmt->close();
		parent::closeConn();

		if(!$userFound)
			return null;
		return array(
			'userID' => $userID, 
			'fname' => $fname,
			'lname' => $lname,
			'username' => $username,
			'password' => $password,
			'amount' => $amount
		);
	}

	public static function getUserByUsernameAndPassword($username, $password){
		parent::startConn();
		$stmt = parent::getConn()->prepare('SELECT user_id, username, password FROM user WHERE username=? AND password=?');
		$stmt->bind_param("ss", $username, $password);
		$stmt->execute();
		$stmt->bind_result($userID, $username, $password);
		$userFound = $stmt->fetch();
		$stmt->close();
		parent::closeConn();
		
		if(!$userFound)
			return null;
		return array(
			'userID' => $userID,
			'username' => $username,
			'password' => $password
		);
	}

	public static function getUsers(){
		parent::startConn();
		$result = parent::presentRSAsArray(parent::getConn()->query('SELECT user_id, fname, lname, username, password, amount FROM user'));
		parent::closeConn();
		return $result;
	}

	public static function addUser($fname, $lname, $username, $password, $amount){
		parent::addEntity(array(
			'fname' => $fname,
			'lname' => $lname,
			'username' => $username,
			'password' => $password,
			'amount' => $amount
		), 'user', 'ssssi');
	}

	public static function editUser($userID, $updateArr){
		parent::editEntity($userID, $updateArr, 'user', 'user_id');
	}

	public static function deleteUser($userID){
		parent::deleteEntity($userID, 'user', 'user_id');
	}
}