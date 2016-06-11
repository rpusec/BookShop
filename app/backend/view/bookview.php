<?php

session_start();

if(isset($_GET['funct']))
{
	switch($_GET['funct'])){
		case 'get-books' : 
			print json_encode(BookContr::getBooks());
			break;
		case 'add-book-to-cart' : 
			print json_encode(BookContr::addBookToCart($_GET['bookID']));
			break;
		case 'remove-book-from-cart' : 
			print json_encode(BookContr::removeBookFromCart($_GET['bookCopyID']));
			break;
	}
}