-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Nov 22, 2015 at 01:41 AM
-- Server version: 5.5.46-0ubuntu0.14.04.2
-- PHP Version: 5.5.9-1ubuntu4.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `tntu`
--

-- --------------------------------------------------------

--
-- Table structure for table `callStatus`
--

CREATE TABLE IF NOT EXISTS `callStatus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(10) NOT NULL,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `callStatus`
--

INSERT INTO `callStatus` (`id`, `code`) VALUES
(1, 'Прийнятий'),
(2, 'В роботі'),
(3, 'Завершено'),
(4, 'Відмова');

-- --------------------------------------------------------

--
-- Table structure for table `car`
--

CREATE TABLE IF NOT EXISTS `car` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `number` varchar(12) NOT NULL,
  `model` varchar(64) NOT NULL,
  `description` varchar(64) NOT NULL,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `car`
--

INSERT INTO `car` (`id`, `number`, `model`, `description`) VALUES
(1, '22', 'm2', 'desc'),
(2, 'a', 'a', '');

-- --------------------------------------------------------

--
-- Table structure for table `department`
--

CREATE TABLE IF NOT EXISTS `department` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `department`
--

INSERT INTO `department` (`id`, `name`) VALUES
(1, 'Невизначено'),
(2, '111a'),
(3, '222');

-- --------------------------------------------------------

--
-- Table structure for table `schedule`
--

CREATE TABLE IF NOT EXISTS `schedule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `month` int(5) NOT NULL,
  `year` int(4) NOT NULL,
  `departmentId` int(11) NOT NULL,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=25 ;

--
-- Dumping data for table `schedule`
--

INSERT INTO `schedule` (`id`, `month`, `year`, `departmentId`) VALUES
(1, 1, 2015, 0),
(2, 1, 2015, 0),
(3, 1, 2015, 0),
(4, 1, 2015, 0),
(5, 1, 2015, 0),
(6, 1, 2015, 0),
(7, 1, 2015, 0),
(8, 1, 2015, 0),
(9, 1, 2015, 0),
(10, 1, 2015, 0),
(11, 1, 2015, 0),
(12, 1, 2015, 0),
(13, 1, 2015, 0),
(14, 1, 2015, 0),
(15, 1, 2015, 0),
(16, 1, 2015, 0),
(17, 1, 2015, 0),
(18, 1, 2015, 0),
(19, 1, 2015, 0),
(20, 1, 2015, 1),
(21, 1, 2015, 2),
(22, 5, 2015, 2),
(23, 1, 2015, 1),
(24, 1, 2015, 1);

-- --------------------------------------------------------

--
-- Table structure for table `scheduleLine`
--

CREATE TABLE IF NOT EXISTS `scheduleLine` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dayOfMonth` int(10) NOT NULL,
  `userId` int(11) NOT NULL,
  `teamId` int(5) NOT NULL,
  `shiftTypeId` int(11) NOT NULL,
  `done` int(1) NOT NULL DEFAULT '0',
  `scheduleId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_2` (`id`),
  KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=28 ;

--
-- Dumping data for table `scheduleLine`
--

INSERT INTO `scheduleLine` (`id`, `dayOfMonth`, `userId`, `teamId`, `shiftTypeId`, `done`, `scheduleId`) VALUES
(2, 1, 16, 1, 1, 0, 18),
(3, 2, 16, 1, 1, 0, 18),
(4, 2, 16, 1, 1, 0, 19),
(5, 1, 16, 1, 1, 0, 19),
(6, 3, 13, 1, 1, 0, 19),
(7, 5, 12, 1, 1, 0, 19),
(8, 12, 10, 1, 1, 0, 19),
(9, 6, 18, 1, 1, 0, 19),
(10, 6, 9, 1, 1, 0, 19),
(11, 10, 7, 1, 1, 0, 19),
(12, 12, 6, 1, 1, 0, 19),
(13, 13, 9, 1, 1, 0, 19),
(15, 1, 11, 1, 1, 0, 21),
(16, 1, 11, 1, 1, 0, 22),
(17, 3, 11, 1, 1, 0, 22),
(18, 1, 11, 1, 1, 0, 23),
(19, 2, 11, 1, 1, 0, 23),
(20, 3, 11, 1, 1, 0, 23),
(21, 3, 11, 1, 1, 0, 24),
(22, 1, 11, 1, 2, 0, 24),
(23, 2, 11, 3, 2, 1, 24),
(24, 4, 11, 1, 1, 0, 23),
(25, 4, 11, 1, 1, 0, 23),
(26, 4, 11, 1, 1, 0, 23),
(27, 4, 11, 1, 1, 0, 24);

-- --------------------------------------------------------

--
-- Table structure for table `shiftType`
--

CREATE TABLE IF NOT EXISTS `shiftType` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `shiftType`
--

INSERT INTO `shiftType` (`id`, `code`) VALUES
(1, 'D'),
(2, 'N'),
(3, 'DN');

-- --------------------------------------------------------

--
-- Table structure for table `team`
--

CREATE TABLE IF NOT EXISTS `team` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `shortName` varchar(5) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `team`
--

INSERT INTO `team` (`id`, `name`, `shortName`) VALUES
(1, 'бригада 1q', 'бр1'),
(2, 'бригада 2', 'бр2'),
(3, 'q', 'q');

-- --------------------------------------------------------

--
-- Table structure for table `teamToCar`
--

CREATE TABLE IF NOT EXISTS `teamToCar` (
  `teamId` int(11) NOT NULL,
  `carId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `teamToCar`
--

INSERT INTO `teamToCar` (`teamId`, `carId`) VALUES
(1, 1),
(2, 1),
(3, 2);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `password` varchar(64) NOT NULL,
  `mail` varchar(64) NOT NULL,
  `active` int(1) NOT NULL DEFAULT '0',
  `roleId` int(11) NOT NULL,
  `departmentId` int(11) NOT NULL,
  `hash` varchar(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`),
  KEY `roleId` (`roleId`),
  KEY `departmentId` (`departmentId`),
  KEY `roleId_2` (`roleId`),
  KEY `departmentId_2` (`departmentId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=21 ;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `password`, `mail`, `active`, `roleId`, `departmentId`, `hash`) VALUES
(1, 'wer1', '2222222', 'kk%40ew.rr', 1, 2, 2, ''),
(2, 'wer', '2222222', 'kk%40ew.re', 1, 0, 1, '456'),
(3, 'wer', '123', 'qq@qq.com', 1, 1, 0, '123'),
(4, 'wer', '2222222', 'kk%40ew.rd', 0, 0, 0, ''),
(5, 'wer', '2222222', 'kk%40ew.rd', 0, 0, 0, ''),
(6, 'wer', '2222222', 'kk%40ew.rd', 0, 0, 0, ''),
(7, 'wer', '2222222', 'kk%40ew.rd', 0, 0, 0, ''),
(8, 'wer', '2222222', 'kk%40ew.rd', 0, 0, 0, ''),
(9, 'wer', '2222222', 'kk%40ew.rd', 0, 0, 0, ''),
(10, 'wer', '2222222', 'kk%40ew.rd', 0, 0, 0, ''),
(11, 'wer', '2222222', 'kk%40ew.rd', 0, 0, 0, ''),
(12, 'wer', '2222222', 'kk%40ew.rd', 0, 0, 0, ''),
(13, 'wer', '2222222', 'kk%40ew.rd', 0, 0, 0, ''),
(14, 'wer', '2222222', 'kk%40ew.rd', 0, 0, 0, ''),
(15, 'wer', '2222222', 'kk%40ew.rd', 0, 0, 0, ''),
(16, 'wer', '2222222', 'kk%40ew.rd', 0, 0, 0, ''),
(17, 'wer', '2222222', 'kk%40ew.rd', 0, 0, 0, ''),
(18, 'wer', '2222222', 'kk%40ew.rt', 0, 0, 2, ''),
(19, 'q', '123', 'qq1@qq.com', 0, 0, 0, '-1130819280'),
(20, '1', '123', 'qq2@qq.com', 1, 1, 2, '1367196657');

-- --------------------------------------------------------

--
-- Table structure for table `userRole`
--

CREATE TABLE IF NOT EXISTS `userRole` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(11) NOT NULL,
  UNIQUE KEY `id` (`id`),
  KEY `id_2` (`id`),
  KEY `id_3` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `userRole`
--

INSERT INTO `userRole` (`id`, `code`) VALUES
(0, 'undefined'),
(1, 'admin'),
(2, 'doctor'),
(3, 'doctorAssys'),
(4, 'driver'),
(5, 'paramedic');

-- --------------------------------------------------------

--
-- Table structure for table `_call`
--

CREATE TABLE IF NOT EXISTS `_call` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `inPhone` varchar(20) NOT NULL,
  `address` varchar(100) NOT NULL,
  `description` varchar(100) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `teamId` int(11) NOT NULL,
  `callStatusId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `teamId` (`teamId`),
  KEY `teamId_2` (`teamId`),
  KEY `callStatusId` (`callStatusId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `_call`
--

INSERT INTO `_call` (`id`, `inPhone`, `address`, `description`, `date`, `teamId`, `callStatusId`) VALUES
(1, '222-324-43', 'улица Строителей дом 22 кв 5', 'спросить Васю', '2015-11-21 22:46:50', 1, 1);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
