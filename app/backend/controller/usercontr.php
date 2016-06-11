<?php

require_once('../dbutil/userdb.php');

class UserContr
{
	public function getUsers(){
		return array('users' => UserDB::getUsers());		
	}
}