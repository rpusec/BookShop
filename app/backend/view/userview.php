<?php 

if(isset($_GET['funct']))
{
	switch($_GET['funct'])){
		case 'get' : 
			print json_encode(UserContr::getUsers());
			break;
		case 'add' :
			print json_encode(UserContr::addUser($_GET['fname'], $_GET['lname'], $_GET['username'], $_GET['password'])); 
			break;
		case 'edit' : 
			if(!isset($_GET['fname'])){$_GET['fname']) = '';}
			if(!isset($_GET['lname'])){$_GET['lname']) = '';}
			if(!isset($_GET['username'])){$_GET['username']) = '';}
			if(!isset($_GET['password'])){$_GET['password']) = '';}
			print json_encode(UserContr::editUser($_GET['user_id'], $_GET['fname'], $_GET['lname'], $_GET['username'], $_GET['password'])));
			break;
		case 'delete' : 
			print json_encode(UserContr::deleteUser($_GET['user_id']));
			break;
	}
}