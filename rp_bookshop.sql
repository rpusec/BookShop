-- phpMyAdmin SQL Dump
-- version 4.1.12
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jun 15, 2016 at 02:41 PM
-- Server version: 5.6.16
-- PHP Version: 5.5.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `rp_bookshop`
--
CREATE DATABASE IF NOT EXISTS `rp_bookshop` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `rp_bookshop`;

-- --------------------------------------------------------

--
-- Table structure for table `book`
--

CREATE TABLE IF NOT EXISTS `book` (
  `book_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` int(11) NOT NULL,
  `author` varchar(100) NOT NULL,
  `description` varchar(100) NOT NULL,
  `price` int(11) NOT NULL,
  PRIMARY KEY (`book_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `book_copy`
--

CREATE TABLE IF NOT EXISTS `book_copy` (
  `book_copy_id` int(11) NOT NULL AUTO_INCREMENT,
  `book_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`book_copy_id`),
  KEY `book_id` (`book_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `fname` varchar(100) NOT NULL,
  `lname` varchar(100) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `amount` int(11) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=21 ;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `fname`, `lname`, `username`, `password`, `amount`) VALUES
(1, 'Roman', 'Pusec', 'rpusec1', 'test', 500),
(2, 'Teo', 'Ruzic', 'truzic1', 'test', 500),
(3, 'Toni', 'Golac', 'tgolac1', 'test', 500),
(4, 'Heizel', 'Raspberry', 'hrap1', 'test', 500),
(5, 'Roman', 'Pusec', 'rpusec2', 'test', 500),
(6, 'Teo', 'Ruzic', 'truzic2', 'test', 500),
(7, 'Toni', 'Golac', 'tgolac2', 'test', 500),
(8, 'Heizel', 'Raspberry', 'hrap2', 'test', 500),
(9, 'Roman', 'Pusec', 'rpusec3', 'test', 500),
(10, 'Teo', 'Ruzic', 'truzic3', 'test', 500),
(11, 'Toni', 'Golac', 'tgolac3', 'test', 500),
(12, 'Heizel', 'Raspberry', 'hrap3', 'test', 500),
(13, 'Roman', 'Pusec', 'rpusec2', 'test', 500),
(14, 'Teo', 'Ruzic', 'truzic2', 'test', 500),
(15, 'Toni', 'Golac', 'tgolac2', 'test', 500),
(16, 'Heizel', 'Raspberry', 'hrap2', 'test', 500),
(17, 'Roman', 'Pusec', 'rpusec3', 'test', 500),
(18, 'Teo', 'Ruzic', 'truzic3', 'test', 500),
(19, 'Toni', 'Golac', 'tgolac3', 'test', 500),
(20, 'Heizel', 'Raspberry', 'hrap3', 'test', 500);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `book_copy`
--
ALTER TABLE `book_copy`
  ADD CONSTRAINT `fk_book_id` FOREIGN KEY (`book_id`) REFERENCES `book` (`book_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
