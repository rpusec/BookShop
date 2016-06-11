<?php

require_once('../dbutil/userdb.php');
require_once('../config/cartconfig.php');

class UserContr
{
	public function getUsers(){
		return array('users' => UserDB::getUsers());		
	}

	public function addUser($fname, $lname, $username, $password){
		return array('userAdded' => UserDB::addUser($fname, $lname, $username, $password, INITIAL_AMOUNT));
	}

	public function editUser($userID, $fname, $lname, $username, $password){

		$updateArr = new Array();

		if($fname !== '')
			$updateArr['fname'] = array('value' => $fname, 'type' => 's');

		if($lname !== '')
			$updateArr['lname'] = array('value' => $lname, 'type' => 's');

		if($username !== '')
			$updateArr['username'] = array('value' => $username, 'type' => 's');

		if($password !== '')
			$updateArr['password'] = array('value' => $password, 'type' => 's');

		return array('userEdited' => UserDB::editUser($userID, $updateArr));
	}

	public function deleteUser($userID){
		return array('userDeleted' => UserDB::deleteUser($userID));	
	}
}