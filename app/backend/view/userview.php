<?php 

if(isset($_GET['funct']))
{
	switch($_GET['funct'])){
		case 'get' : 
			print json_encode(UserContr::getUsers());
			break;
		case 'add' :
			print json_encode(UserContr::addUser()); 
			break;
		case 'edit' : 
			print json_encode(UserContr::editUser());
			break;
		case 'delete' : 
			print json_encode(UserContr::deleteUser());
			break;
	}
}