<?php

require_once('../controller/bookcontr.php');

session_start();

if(isset($_GET['funct']))
{
	switch($_GET['funct']){
		case 'get-books' : 
			print json_encode(BookContr::getBooks($_GET['currentPage'], $_GET['perPage']));
			break;
		case 'add-book' : 
			print json_encode(BookContr::addBook(
				$_GET['title'], 
				$_GET['author'], 
				$_GET['description'], 
				$_GET['price']
			));
			break;
		case 'edit-book' : 
			if(!isset($_GET['title'])){$_GET['title'] = '';}
			if(!isset($_GET['author'])){$_GET['author'] = '';}
			if(!isset($_GET['description'])){$_GET['description'] = '';}
			if(!isset($_GET['price'])){$_GET['price'] = '';}
			print json_encode(BookContr::editBook(
				$_GET['bookID'], 
				$_GET['title'], 
				$_GET['author'], 
				$_GET['description'], 
				$_GET['price']
			));
			break;
		case 'delete-book' : 
			print json_encode(BookContr::deleteBook($_GET['bookID']));
			break;
		case 'add-book-to-cart' : 
			print json_encode(BookContr::addBookToCart($_GET['bookID']));
			break;
		case 'remove-book-from-cart' : 
			print json_encode(BookContr::removeBookFromCart($_GET['bookCopyID']));
			break;
	}
}