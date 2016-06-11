<?php 

require_once('basedb.php');

class UserDB extends BaseDB
{
	public function getUser($userID){
		parent::startConn();
		$stmt = (parent::getConn())->prepare('SELECT fname, lname, username, password, amount FROM user WHERE user_id=?');
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

	public function getUserByUsernameAndPassword($username, $password){
		parent::startConn();
		$stmt = (parent::getConn())->prepare('SELECT user_id, username, password FROM user WHERE username=? AND password=?');
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

	public function getUsers(){
		parent::startConn();
		$result = parent::presentRSAsArray((parent::getConn())->query('SELECT user_id, fname, lname, username, password, amount FROM user'));
		parent::closeConn();
		return $result;
	}

	public function addUser($fname, $lname, $username, $password, $amount){
		parent::startConn();
		$stmt = (parent::getConn())->prepare('INSERT INTO user (fname, lname, username, password, amount) VALUES (?, ?, ?, ?, ?)');
		$stmt->bind_param("ssssi", $fname, $lname, $username, $password, $amount);
		$stmt->execute();
		$stmt->close();
		parent::closeConn();
		return $stmt->affected_rows === 1;			
	}

	public function editUser($userID, $updateArr){
		parent::startConn();

		$sql = 'UPDATE user SET ';
		$bindStr = "";
		$values = array();

		foreach($updateArr as $updateKey => $updateInfo)
		{
			$sql .= "$updateKey=? ";
			$bindStr .= $updateInfo['type'];
			array_push($values, $updateInfo['value']);
		}

		$sql .= "WHERE user_id=?";
		$bindStr .= "i";
		array_push($values, $userID);
		array_unshift($values, $bindStr);

		$stmt = (parent::getConn())->prepare($sql);
		call_user_func_array(array($stmt, "bind_param"), $values);
		$stmt->execute();
		$stmt->close();
		parent::closeConn();

		return $stmt->affected_rows === 1;
	}

	public function deleteUser($userID){
		parent::startConn();
		$stmt = (parent::getConn())->prepare('DELETE FROM user WHERE user_id=?');
		$stmt->bind_param("i", $userID);
		$stmt->execute();
		$stmt->close();
		parent::closeConn();
		return $stmt->affected_rows === 1;
	}
}