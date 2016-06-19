<?php

require_once('../dbutil/userdb.php');
require_once('../config/appconfig.php');
require_once('../logic/authbusiness.php');

class UserContr
{
	public function loginUser($username, $password){
		if(AuthBusiness::isAuthenticated())
			AuthBusiness::logoutUser();

		UserDB::startConn();
		if(($user = UserDB::getUserByUsernameAndPassword($username, $password)) !== null)
		{
			AuthBusiness::setUser($user['userID']);
			return array('loginSuccess' => true, 'message' => LOGIN_MESSAGE, 'user' => $user);
		}

		return array('loginSuccess' => false, 'message' => WRONG_CREDENTIALS_ERROR);
	}

	public function logoutUser(){
		if(!AuthBusiness::isAuthenticated())
			return array('logoutSuccess' => false, 'message' => AUTHENTICATION_ERROR);

		AuthBusiness::logoutUser();
		return array('logoutSuccess' => true, 'message' => LOGOUT_MESSAGE);
	}

	public function getUsers($currentPage, $perPage){
		if(!AuthBusiness::isAuthenticated())
			return array('authenticated' => false, 'message' => AUTHENTICATION_ERROR);

		UserDB::startConn();
		$users = UserDB::getUsers($currentPage, $perPage);
		$userCount = UserDB::getUserCount();
		return array(
			'authenticated' => true,
			'users' => $users,
			'userCount' => $userCount
		);		
	}

	public function getUser($userID){
		if(!AuthBusiness::isAuthenticated())
			return array('authenticated' => false, 'message' => AUTHENTICATION_ERROR);

		UserDB::startConn();
		return array(
			'authenticated' => true,
			'message' => 'User recieved. ',
			'user' => UserDB::getUser($userID));		
	}

	public function addUser($fname, $lname, $username, $password){
		if(!AuthBusiness::isAuthenticated())
			return array('authenticated' => false, 'message' => AUTHENTICATION_ERROR);

		UserDB::startConn();
		return array(
			'authenticated' => true,
			'message' => 'User added. ',
			'userAdded' => UserDB::addUser($fname, $lname, $username, $password, INITIAL_AMOUNT));
	}

	public function editUser($userID, $fname, $lname, $username, $password, $amount){
		if(!AuthBusiness::isAuthenticated())
			return array('authenticated' => false, 'message' => AUTHENTICATION_ERROR);

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

		return array(
			'authenticated' => true,
			'message' => 'User edited. ',
			'userEdited' => UserDB::editUser($userID, $updateArr));
	}

	public function deleteUser($userID){
		if(!AuthBusiness::isAuthenticated())
			return array('authenticated' => false, 'message' => AUTHENTICATION_ERROR);

		UserDB::startConn();
		return array(
			'authenticated' => true,
			'message' => 'User deleted. ',
			'userDeleted' => UserDB::deleteUser($userID));	
	}
}