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
		if(isset($username) && isset($password) && ($user = UserDB::getUserByUsernameAndPassword($username, $password)) !== null)
		{
			AuthBusiness::setUser($user['userID'], $user['is_admin']);
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

		if(!AuthBusiness::isAdmin())
			return array('authenticated' => false, 'message' => INSUFFICIENT_PRIVILEGE);

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

		if(!AuthBusiness::isAdmin() && $userID != AuthBusiness::getUser())
			return array('authenticated' => false, 'message' => INSUFFICIENT_PRIVILEGE);

		UserDB::startConn();
		return array(
			'authenticated' => true,
			'message' => 'User recieved. ',
			'user' => UserDB::getUser($userID));		
	}

	public function addUser($fname, $lname, $username, $password, $amount, $is_admin){
		if(!AuthBusiness::isAuthenticated())
			return array('authenticated' => false, 'message' => AUTHENTICATION_ERROR);

		if(!AuthBusiness::isAdmin())
			return array('authenticated' => false, 'message' => INSUFFICIENT_PRIVILEGE);

		ValidationHelper::validateInput($fname, 'alphabetic', FNAME_ERROR, 'fname');
		ValidationHelper::validateInput($lname, 'alphabetic', LNAME_ERROR, 'lname');
		ValidationHelper::validateInput($username, 'alphaNumeric', USERNAME_ERROR, 'username');
		ValidationHelper::validateInput($password, 'alphaNumeric', PASSWORD_ERROR, 'password');
		ValidationHelper::validateInput($amount, 'numeric', AMOUNT_ERROR, 'amount');

		ValidationHelper::checkAppropriateInputLength($fname, FNAME_LENGTH_FROM, FNAME_LENGTH_TO, 'fname', 'fname');
		ValidationHelper::checkAppropriateInputLength($lname, LNAME_LENGTH_FROM, LNAME_LENGTH_TO, 'lname', 'lname');
		ValidationHelper::checkAppropriateInputLength($username, USERNAME_LENGTH_FROM, USERNAME_LENGTH_TO, 'username', 'username');
		ValidationHelper::checkAppropriateInputLength($password, PASSWORD_LENGTH_FROM, PASSWORD_LENGTH_TO, 'password', 'password');
		ValidationHelper::checkAppropriateInputLength($amount, AMOUNT_LENGTH_FROM, AMOUNT_LENGTH_TO, 'amount', 'amount');
		
		if(!ValidationHelper::checkAppropriateInputLength($is_admin, 0, 1, 'is admin', 'is_admin'))
			ValidationHelper::checkIfEmpty($is_admin, 'admin', 'is_admin');

		if(ValidationHelper::hasErrors())
			return array('authenticated' => true, 'hasErrors' => true, 'errors' => ValidationHelper::getErrors());

		UserDB::startConn();
		return array(
			'hasErrors' => false,
			'authenticated' => true,
			'message' => 'User added. ',
			'userAdded' => UserDB::addUser($fname, $lname, $username, $password, $amount, $is_admin));
	}

	public function editUser($userID, $fname, $lname, $username, $password, $amount, $is_admin){
		if(!AuthBusiness::isAuthenticated())
			return array('authenticated' => false, 'message' => AUTHENTICATION_ERROR);

		if(!AuthBusiness::isAdmin() && $userID != AuthBusiness::getUser())
			return array('authenticated' => false, 'message' => INSUFFICIENT_PRIVILEGE);

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

		if($fname == '' && $lname == '' && $username == '' && $password == '' && $amount == '' && $is_admin == '')
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

		if($is_admin !== '')
		{
			$is_admin = filter_var($is_admin, FILTER_VALIDATE_BOOLEAN);
			$updateArr['is_admin'] = array('value' => $is_admin ? 1 : 0, 'type' => 'i');
		}

		return array(
			'hasErrors' => false,
			'authenticated' => true,
			'message' => 'User edited. ',
			'userEdited' => UserDB::editUser($userID, $updateArr));
	}

	public function deleteUser($userID){
		if(!AuthBusiness::isAuthenticated())
			return array('authenticated' => false, 'message' => AUTHENTICATION_ERROR);

		if(!AuthBusiness::isAdmin())
			return array('authenticated' => false, 'message' => INSUFFICIENT_PRIVILEGE);

		UserDB::startConn();
		return array(
			'authenticated' => true,
			'message' => 'User deleted. ',
			'userDeleted' => UserDB::deleteUser($userID));	
	}
}