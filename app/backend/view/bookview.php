<?php

session_start();

require_once('../controller/bookcontr.php');

if(isset($_GET['funct']))
{
	switch($_GET['funct']){
		case 'get-books' : 
			if(!isset($_GET['searchBy'])){$_GET['searchBy'] = null;}
			if(!isset($_GET['filter'])){$_GET['filter'] = null;}
			print json_encode(BookContr::getBooks($_GET['currentPage'], $_GET['perPage'], $_GET['searchBy'], $_GET['filter']));
			break;
		case 'add-book' : 
			if(!isset($_GET['title'])){$_GET['title'] = '';}
			if(!isset($_GET['author'])){$_GET['author'] = '';}
			if(!isset($_GET['description'])){$_GET['description'] = '';}
			if(!isset($_GET['price'])){$_GET['price'] = '';}
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
				$_GET['price'])
			);
			break;
		case 'delete-book' : 
			print json_encode(BookContr::deleteBook($_GET['bookID']));
			break;
		case 'get-book-copies' : 
			print json_encode(BookContr::getBookCopies(
				$_GET['bookID'], 
				$_GET['currentPage'], 
				$_GET['perPage'])
			);
			break;
		case 'add-book-copies' : 
			print json_encode(BookContr::addBookCopies(
				$_GET['bookID'], 
				$_GET['copyAmount'])
			);
			break;
		case 'delete-book-copies' : 
			print json_encode(BookContr::removeBookCopies($_GET['strBookCopyIDs']));
			break;
		case 'get-catalogue' : 
			if(!isset($_GET['searchBy'])){$_GET['searchBy'] = null;}
			if(!isset($_GET['filter'])){$_GET['filter'] = null;}
			print json_encode(BookContr::getCatalogue($_GET['currentPage'], $_GET['perPage'], $_GET['searchBy'], $_GET['filter']));
			break;
		case 'get-books-from-cart' : 
			if(!isset($_GET['searchBy'])){$_GET['searchBy'] = null;}
			if(!isset($_GET['filter'])){$_GET['filter'] = null;}
			print json_encode(BookContr::getBooksFromCart($_GET['currentPage'], $_GET['perPage'], $_GET['searchBy'], $_GET['filter']));
			break;
		case 'add-book-to-cart' : 
			print json_encode(BookContr::addBookToCart($_GET['bookID']));
			break;
		case 'remove-book-from-cart' : 
			print json_encode(BookContr::removeBookFromCart($_GET['bookID']));
			break;
	}
}