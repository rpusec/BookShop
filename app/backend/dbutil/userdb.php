<?php 

class UserDB extends BaseDB
{
	public function getUsers(){
		return parent::presentRSAsArray(mysqli_query(parent::getConn(), 'SELECT user_id, fname, lname, username, password, amount FROM user'));
	}
}