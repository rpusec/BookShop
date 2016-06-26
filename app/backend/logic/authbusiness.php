<?php

class AuthBusiness{
	const ADMIN = 1;

	public static function setUser($userID, $is_admin){
		$_SESSION['userID'] = $userID;
		$_SESSION['is_admin'] = $is_admin;
	}

	public static function isAuthenticated(){
		return isset($_SESSION['userID']) && isset($_SESSION['is_admin']);
	}

	public static function isAdmin(){
		return $_SESSION['is_admin'] == self::ADMIN;
	}

	public static function getUser(){
		return $_SESSION['userID'];
	}

	public static function logoutUser(){
		unset($_SESSION['userID']);
		unset($_SESSION['is_admin']);
		session_destroy();
	}
}