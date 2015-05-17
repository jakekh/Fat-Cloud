-- phpMyAdmin SQL Dump
-- version 3.5.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Mar 22, 2015 at 02:36 AM
-- Server version: 5.5.25
-- PHP Version: 5.4.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "-07:00";

--
-- Database: `fatcloud`
--

-- --------------------------------------------------------

--
-- Table structure for table `passwordReset`
--

CREATE TABLE `passwordReset` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(250) NOT NULL,
  `ipaddress` varchar(250) NOT NULL,
  `lastReset` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `hash` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `admin` tinyint(1) NOT NULL,
  `email` varchar(250) NOT NULL,
  `password` varchar(250) DEFAULT NULL,
  `name` varchar(250) NOT NULL,
  `phone` varchar(250) DEFAULT NULL,
  `lastLogin` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `sessionId` varchar(250) DEFAULT NULL,
  `active` tinyint(1) NOT NULL,
  `hash` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `admin`, `email`, `password`, `name`, `phone`, `lastLogin`, `sessionId`, `active`, `hash`) VALUES
(1, 1, 'admin@fatcloud.com', '$2y$10$TX1KAuLbpG9mk9/ZIJlZCun.SbZZcZ5jkfQYRG7dporWp5qg.ESNe', 'Admin User', '1234567890', '2015-03-11 01:45:56', NULL, 1, 'MGQ1NjU0ZjQ0MmEwNzA3YTIwMjJjNzhmODM2ZDIxZWE');