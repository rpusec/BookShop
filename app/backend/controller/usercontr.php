<?php

require_once('../dbutil/userdb.php');
require_once('../config/appconfig.php');
require_once('../logic/authbusiness.php');
require_once('../validation/ValidationHelper.class.php');

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

		ValidationHelper::validateInput($fname, 'alphabetic', FNAME_ERROR, 'fname');
		ValidationHelper::validateInput($lname, 'alphabetic', LNAME_ERROR, 'lname');
		ValidationHelper::validateInput($username, 'alphaNumeric', USERNAME_ERROR, 'username');
		ValidationHelper::validateInput($password, 'alphaNumeric', PASSWORD_ERROR, 'password');
		ValidationHelper::validateInput($amount, 'decimal', AMOUNT_ERROR, 'amount');

		ValidationHelper::checkAppropriateInputLength($fname, FNAME_LENGTH_FROM, FNAME_LENGTH_TO, 'fname', 'fname');
		ValidationHelper::checkAppropriateInputLength($lname, LNAME_LENGTH_FROM, LNAME_LENGTH_TO, 'lname', 'lname');
		ValidationHelper::checkAppropriateInputLength($username, USERNAME_LENGTH_FROM, USERNAME_LENGTH_TO, 'username', 'username');
		ValidationHelper::checkAppropriateInputLength($password, PASSWORD_LENGTH_FROM, PASSWORD_LENGTH_TO, 'password', 'password');
		ValidationHelper::checkAppropriateInputLength($amount, AMOUNT_LENGTH_FROM, AMOUNT_LENGTH_TO, 'amount', 'amount');

		UserDB::startConn();
		return array(
			'authenticated' => true,
			'message' => 'User added. ',
			'userAdded' => UserDB::addUser($fname, $lname, $username, $password, INITIAL_AMOUNT));
	}

	public function editUser($userID, $fname, $lname, $username, $password, $amount){
		if(!AuthBusiness::isAuthenticated())
			return array('authenticated' => false, 'message' => AUTHENTICATION_ERROR);

		if($fname !== '')
		{
			ValidationHelper::validateInput($fname, 'alphabetic', FNAME_ERROR, 'fname');
			ValidationHelper::checkAppropriateInputLength($fname, FNAME_LENGTH_FROM, FNAME_LENGTH_TO, 'fname', 'fname');
		}

		if($lname !== '')
		{
			ValidationHelper::validateInput($lname, 'alphabetic', LNAME_ERROR, 'lname');
			ValidationHelper::checkAppropriateInputLength($lname, LNAME_LENGTH_FROM, LNAME_LENGTH_TO, 'lname', 'lname');
		}

		if($username !== '')
		{
			ValidationHelper::validateInput($username, 'alphaNumeric', USERNAME_ERROR, 'username');
			ValidationHelper::checkAppropriateInputLength($username, USERNAME_LENGTH_FROM, USERNAME_LENGTH_TO, 'username', 'username');
		}

		if($password !== '')
		{
			ValidationHelper::validateInput($password, 'alphaNumeric', PASSWORD_ERROR, 'password');
			ValidationHelper::checkAppropriateInputLength($password, PASSWORD_LENGTH_FROM, PASSWORD_LENGTH_TO, 'password', 'password');
		}

		if($amount !== '')
		{
			ValidationHelper::validateInput($amount, 'numeric', AMOUNT_ERROR, 'amount');
			ValidationHelper::checkAppropriateInputLength($amount, AMOUNT_LENGTH_FROM, AMOUNT_LENGTH_TO, 'amount', 'amount');
		}

		if($fname == '' && $lname == '' && $username == '' && $password == '' && $amount == '')
			ValidationHelper::addError('Please change at least one input. ', 'none');

		if(ValidationHelper::hasErrors())
			return array('authenticated' => true, 'hasErrors' => true, 'errors' => ValidationHelper::getErrors());

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
			'hasErrors' => false,
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