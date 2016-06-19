<?php

class AuthBusiness{
	public static function setUser($userID){
		$_SESSION['userID'] = $userID;
	}

	public static function isAuthenticated(){
		return isset($_SESSION['userID']);
	}

	public static function getUser(){
		return $_SESSION['userID'];
	}

	public static function logoutUser(){
		unset($_SESSION['userID']);
		session_destroy();
	}
}