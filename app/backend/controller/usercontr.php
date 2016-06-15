<?php

require_once('../dbutil/userdb.php');
require_once('../config/cartconfig.php');

class UserContr
{
	public function loginUser($username, $password){
		UserDB::startConn();
		if(($user = UserDB::getUserByUsernameAndPassword($username, $password)) !== null)
		{
			$_SESSION['userID'] = $user->userID;
			return array('loginSuccess' => true);
		}

		return array('loginSuccess' => false);
	}

	public function logoutUser(){
		unset($_SESSION['userID']);
		session_destroy();
		return array('logoutSuccess' => true);
	}

	public function getUsers($currentPage, $perPage){
		UserDB::startConn();
		$users = UserDB::getUsers($currentPage, $perPage);
		$userCount = UserDB::getUserCount();
		return array(
			'users' => $users,
			'userCount' => $userCount
		);		
	}

	public function getUser($userID){
		UserDB::startConn();
		return array('user' => UserDB::getUser($userID));		
	}

	public function addUser($fname, $lname, $username, $password){
		UserDB::startConn();
		return array('userAdded' => UserDB::addUser($fname, $lname, $username, $password, INITIAL_AMOUNT));
	}

	public function editUser($userID, $fname, $lname, $username, $password, $amount){
		UserDB::startConn();
		$updateArr = array();

		if($fname !== '')
			$updateArr['fname'] = array('value' => $fname, 'type' => 's');

		if($lname !== '')
			$updateArr['lname'] = array('value' => $lname, 'type' => 's');

		if($username !== '')
			$updateArr['username'] = array('value' => $username, 'type' => 's');

		if($password !== '')
			$updateArr['password'] = array('value' => $password, 'type' => 's');

		if($amount !== '')
			$updateArr['amount'] = array('value' => $amount, 'type' => 'i');

		return array('userEdited' => UserDB::editUser($userID, $updateArr));
	}

	public function deleteUser($userID){
		UserDB::startConn();
		return array('userDeleted' => UserDB::deleteUser($userID));	
	}
}