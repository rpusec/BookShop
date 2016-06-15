<?php 

require_once('../controller/usercontr.php');

session_start();



if(isset($_GET['funct']))
{
	switch($_GET['funct']){
		case 'login-user' : 
			print json_encode(UserContr::loginUser($_GET['username'], $_GET['password']));
			break;
		case 'logout-user' : 
			print json_encode(UserContr::logoutUser());
			break;
		case 'get-users' : 
			print json_encode(UserContr::getUsers($_GET['currentPage'], $_GET['perPage']));
			break;
		case 'get-user' : 
			print json_encode(UserContr::getUser($_GET['userID']));
			break;
		case 'add-user' :
			print json_encode(UserContr::addUser(
				$_GET['fname'], 
				$_GET['lname'], 
				$_GET['username'], 
				$_GET['password']
			)); 
			break;
		case 'edit-user' : 
			if(!isset($_GET['fname'])){$_GET['fname'] = '';}
			if(!isset($_GET['lname'])){$_GET['lname'] = '';}
			if(!isset($_GET['username'])){$_GET['username'] = '';}
			if(!isset($_GET['password'])){$_GET['password'] = '';}
			if(!isset($_GET['amount'])){$_GET['amount'] = '';}
			print json_encode(UserContr::editUser(
				$_GET['userID'], 
				$_GET['fname'], 
				$_GET['lname'], 
				$_GET['username'], 
				$_GET['password'],
				$_GET['amount']
			));
			break;
		case 'delete-user' : 
			print json_encode(UserContr::deleteUser($_GET['userID']));
			break;
	}
}