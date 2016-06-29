-- phpMyAdmin SQL Dump
-- version 4.1.12
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jun 30, 2016 at 12:47 AM
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
  `title` varchar(100) NOT NULL,
  `author` varchar(100) NOT NULL,
  `description` varchar(200) NOT NULL,
  `price` int(11) NOT NULL,
  PRIMARY KEY (`book_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=11 ;

--
-- Dumping data for table `book`
--

INSERT INTO `book` (`book_id`, `title`, `author`, `description`, `price`) VALUES
(5, 'Baker Of The Ancestors', 'Felica Rothchild', 'sdfsdfLorem ipsum dolor sit amet, velit consectetur adipiscing elit. Etiam tristique orci ac aros elementum, sed placerat turpis rutdfdgfgdf', 40),
(6, 'Pirate Of The Ancients', 'Ruthie Luevano', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam tristique orci ac aros elementum, sed placerat turpis rut', 100),
(7, 'Armies Of The Great', 'Elia Pablo', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. AenesdfdfsdfsfsdfUt eros velit, porta eu justo a, placerat tempus neque. Cras non orci sit amet lectsdfsdfsghfhfgda non a', 35),
(8, 'Warriors Of Historys', 'Sun Occhipinti', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vehicula libero felis, eget porta lorem molestie ac. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.', 50);

-- --------------------------------------------------------

--
-- Table structure for table `book_copy`
--

CREATE TABLE IF NOT EXISTS `book_copy` (
  `book_copy_id` int(11) NOT NULL AUTO_INCREMENT,
  `book_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`book_copy_id`),
  KEY `book_id` (`book_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=158 ;

--
-- Dumping data for table `book_copy`
--

INSERT INTO `book_copy` (`book_copy_id`, `book_id`, `user_id`) VALUES
(100, 6, 24),
(103, 6, NULL),
(104, 6, NULL),
(105, 6, NULL),
(106, 6, NULL),
(107, 6, NULL),
(115, 5, NULL),
(124, 5, 24),
(125, 5, NULL),
(126, 5, NULL),
(127, 5, NULL),
(128, 7, 20),
(130, 7, 20),
(131, 7, 24),
(132, 6, NULL),
(133, 6, NULL),
(134, 8, NULL),
(135, 8, NULL),
(136, 8, NULL),
(137, 8, NULL),
(138, 7, NULL),
(139, 7, NULL),
(140, 7, NULL),
(141, 7, NULL),
(142, 5, NULL),
(143, 5, NULL),
(150, 6, NULL),
(151, 6, NULL),
(156, 5, NULL),
(157, 5, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `fname` varchar(100) NOT NULL,
  `lname` varchar(100) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `amount` int(11) NOT NULL,
  `is_admin` tinyint(1) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=28 ;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `fname`, `lname`, `username`, `password`, `amount`, `is_admin`) VALUES
(13, 'Roman', 'Pusec', 'rpusec', '$2y$10$98a/C3lxm23Eqbq3lpMh2utEmExEOweU8FUEan9hhvoGVg4U3lyby', 500, 1),
(20, 'John', 'Jonily', 'Johnny', '$2y$10$PqJwkoEZvfWXmr6zjFyJ2.5BuXMhb/VoMWSlTXF7x05nCerqOMtPu', 500, 1),
(24, 'Darla', 'Oates', 'doates', '$2y$10$J9lQYojfDTZdipfumX8uG.Gdek0SkbUmqNaryykVIA0TgP0Bbm1Um', 500, 0),
(26, 'Jenna', 'Boyers', 'jboyers', '$2y$10$Rao6Nz.TPXxFSw3AhdA.w.Aqk0UD8fhRogUzny0bn03Uv5TPpymZO', 500, 0);

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
