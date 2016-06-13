<?php

require_once('../dbutil/userdb.php');
require_once('../config/cartconfig.php');

class UserContr
{
	public function loginUser($username, $password){
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

	public function getUsers(){
		return array('users' => UserDB::getUsers());		
	}

	public function getUser($userID){
		return array('user' => UserDB::getUser($userID));		
	}

	public function addUser($fname, $lname, $username, $password){
		return array('userAdded' => UserDB::addUser($fname, $lname, $username, $password, INITIAL_AMOUNT));
	}

	public function editUser($userID, $fname, $lname, $username, $password, $amount){

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
		return array('userDeleted' => UserDB::deleteUser($userID));	
	}
}