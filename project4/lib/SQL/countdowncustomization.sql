-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 05, 2023 at 11:50 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `countdowncustomization`
--

-- --------------------------------------------------------

--
-- Table structure for table `paint`
--

CREATE TABLE `paint` (
  `id` int(11) NOT NULL,
  `fontColor` varchar(7) DEFAULT NULL,
  `background_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `paint`
--

INSERT INTO `paint` (`id`, `fontColor`, `background_path`) VALUES
(1, '#4287ff', 'D:\\Geforce Videos 2023\\Metro Exodus Enhanced Edition\\Metro Exodus Enhanced Edition Screenshot 2023.06.10 - 16.28.53.59.png'),
(2, '#3240a8', 'D:\\Geforce Videos 2023\\Metro Exodus Enhanced Edition\\Metro Exodus Enhanced Edition Screenshot 2023.06.12 - 13.23.13.12.png'),
(3, '#327ba8', 'D:\\Geforce Videos 2023\\Metro Exodus Enhanced Edition\\Metro Exodus Enhanced Edition Screenshot 2023.06.12 - 21.10.03.65.png'),
(4, '#32a887', 'D:\\Geforce Videos 2023\\Metro Exodus Enhanced Edition\\Metro Exodus Enhanced Edition Screenshot 2023.06.15 - 21.41.40.41.png');

-- --------------------------------------------------------

--
-- Table structure for table `userdate`
--

CREATE TABLE `userdate` (
  `id` int(11) NOT NULL,
  `eventName` varchar(50) DEFAULT NULL,
  `eventDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `userdate`
--

INSERT INTO `userdate` (`id`, `eventName`, `eventDate`) VALUES
(2, 'Cyberpunk Release', '2025-06-19'),
(3, 'S.T.A.L.K.E.R Release', '2024-01-06'),
(4, 'My Birtday', '2024-07-20');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `paint`
--
ALTER TABLE `paint`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `userdate`
--
ALTER TABLE `userdate`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `paint`
--
ALTER TABLE `paint`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `userdate`
--
ALTER TABLE `userdate`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
