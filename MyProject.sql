CREATE DATABASE  IF NOT EXISTS `project` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `project`;
-- MySQL dump 10.13  Distrib 8.0.17, for Win64 (x86_64)
--
-- Host: localhost    Database: project
-- ------------------------------------------------------
-- Server version	8.0.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `admin_email` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `admin_password` varchar(400) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `admin_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `admin_dob` date DEFAULT NULL,
  `admin_address` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`admin_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES ('admin1@gmail.com','$2b$12$txVWRh2fccm8HR.33o76u.vD/Ci/mJBBuwj.E5DqrVXvQ0C4Jhnd6','Miracle',NULL,NULL),('admin@gmail.com','$2b$12$nrNS1hINsZ5i0flbPwvwIeKKgyXYFAMHryda0.jsAqaNDg9MvCHDy','Miracle',NULL,NULL);
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `comment_id` int(11) NOT NULL AUTO_INCREMENT,
  `comment_content` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `upload_at` datetime DEFAULT NULL,
  `upload_by` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `document_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`comment_id`),
  KEY `fk_comments_document` (`document_id`),
  CONSTRAINT `fk_comments_document` FOREIGN KEY (`document_id`) REFERENCES `documents` (`document_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,'asd',NULL,NULL,1),(2,'asdasd',NULL,NULL,1),(3,'This is good document',NULL,NULL,1),(4,'10 points',NULL,NULL,1);
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documents`
--

DROP TABLE IF EXISTS `documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documents` (
  `document_id` int(11) NOT NULL AUTO_INCREMENT,
  `document_name` varchar(300) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `title` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `upload_at` datetime DEFAULT NULL,
  `upload_by` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `full_path` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `room_id` int(11) NOT NULL,
  PRIMARY KEY (`document_id`),
  KEY `fk_document_room` (`room_id`),
  CONSTRAINT `fk_document_room` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documents`
--

LOCK TABLES `documents` WRITE;
/*!40000 ALTER TABLE `documents` DISABLE KEYS */;
INSERT INTO `documents` VALUES (1,'Smile.jpg','Smile.jpg','2020-04-28 04:02:03','student2@gmail.com','62020-04-28 04:02:03Smile.jpg',6),(2,'SmilingFace.jpg','SmilingFace.jpg','2020-04-28 04:02:11','student2@gmail.com','62020-04-28 04:02:11SmilingFace.jpg',6),(3,'SmilingFace.jpg','SmilingFace.jpg','2020-04-28 05:15:29','tutor1@gmail.com','72020-04-28 05:15:29SmilingFace.jpg',7);
/*!40000 ALTER TABLE `documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `message_id` int(11) NOT NULL AUTO_INCREMENT,
  `message_content` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `upload_at` datetime DEFAULT NULL,
  `upload_by` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `room_id` int(11) NOT NULL,
  PRIMARY KEY (`message_id`),
  KEY `fk_message_room` (`room_id`),
  CONSTRAINT `fk_message_room` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,'Hello\n','2020-04-28 03:25:26','123',7),(2,'How are you\n','2020-04-28 03:26:55','123',7),(3,'Hello\n','2020-04-28 04:23:10','student2@gmail.com',6),(4,'How are you today?\n','2020-04-28 04:23:18','student2@gmail.com',6),(5,'Hi again\n','2020-04-28 04:48:49','student2@gmail.com',6),(6,'I\'m fine\n','2020-04-28 04:56:08','tutor1@gmail.com',6);
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `notify_id` int(11) NOT NULL AUTO_INCREMENT,
  `notify_name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `notify_content` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`notify_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
INSERT INTO `notification` VALUES (1,'to tutor for allocation','You have new allocation for student: '),(2,'to student for allocation','You have new tutor: ');
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `room_id` int(11) NOT NULL AUTO_INCREMENT,
  `student_email` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `tutor_email` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `creater` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`room_id`),
  KEY `fk_student_room` (`student_email`),
  KEY `fk_tutor_room` (`tutor_email`),
  KEY `fk_staff_room` (`creater`),
  CONSTRAINT `fk_staff_room` FOREIGN KEY (`creater`) REFERENCES `staffs` (`staff_email`),
  CONSTRAINT `fk_student_room` FOREIGN KEY (`student_email`) REFERENCES `students` (`student_email`),
  CONSTRAINT `fk_tutor_room` FOREIGN KEY (`tutor_email`) REFERENCES `tutors` (`tutor_email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,'linhbqgch16506@fpt.edu.vn','tutor2@gmail.com','staff1@gmail.com'),(2,'student5@gmail.com','tutor2@gmail.com','staff1@gmail.com'),(3,'student3@gmail.com','tutor2@gmail.com','staff1@gmail.com'),(4,'student4@gmail.com','tutor4@gmail.com','staff1@gmail.com'),(5,'student6@gmail.com','tutor4@gmail.com','staff1@gmail.com'),(6,'student2@gmail.com','tutor1@gmail.com','staff1@gmail.com'),(7,'student7@gmail.com','tutor1@gmail.com','staff1@gmail.com'),(8,'student8@gmail.com','tutor2@gmail.com','staff2@gmail.com');
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staffs`
--

DROP TABLE IF EXISTS `staffs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staffs` (
  `staff_email` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `staff_password` varchar(400) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `staff_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `staff_dob` date DEFAULT NULL,
  `staff_address` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`staff_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staffs`
--

LOCK TABLES `staffs` WRITE;
/*!40000 ALTER TABLE `staffs` DISABLE KEYS */;
INSERT INTO `staffs` VALUES ('staff1@gmail.com','$2b$12$dBK8VAWYIgcNWwNsZgNbYeAK0K0ly6o1bp5tOFPfD9KyTk2Vqc55i','Dendi',NULL,NULL),('staff2@gmail.com','$2b$12$9Qqf33qvlw2ShXZNlBKEgOE7RYicVTzOwe7p0hRBX6q25nqt.15J6','Alice',NULL,NULL),('staff3@gmail.com','$2b$12$5nDQKtMRi/6stlAClqIFyutekPoeTAj6kXZxW2mnSGRRw4tVUgeby','Trang',NULL,NULL);
/*!40000 ALTER TABLE `staffs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `student_email` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `student_password` varchar(400) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `student_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `student_dob` date DEFAULT NULL,
  `student_address` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`student_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES ('linhbqgch16506@fpt.edu.vn','$2b$12$JeNhXylXyB0Os1PdyoXWweMeQZYd0fXerYBTZG4a7FnWRizfveGVe','Real Linh',NULL,NULL),('student1@gmail.com','$2b$12$QFUdOeNOmLOGPzzJ/1HAn.SkZiN3Lo5EU4DX/o0jqTi7RrmsnoRL6','Linh',NULL,NULL),('student2@gmail.com','$2b$12$FVYUCLiYaQCpZrjuQsRP0ekZcaUzgY1.w9Pz3GGHW4WGmdqs/TF2K','Quyen',NULL,NULL),('student3@gmail.com','$2b$12$rgkoXm063x37P5BOHGoCSu8qOaU1A.XeZvDaI.KaWQwSwQeBzANXq','Huy',NULL,NULL),('student4@gmail.com','$2b$12$Q4j8BmDhsRtM6qh1tpn8Iuz7RROUJOamg4n90QZKSIjMlGF0gphUS','Thuy',NULL,NULL),('student5@gmail.com','$2b$12$3mPeKpj/getJJ1dkax2ygeacwrmBYQl/vzRg/7mEZpnb6yiHgcleO','Thang',NULL,NULL),('student6@gmail.com','$2b$12$nC4AMuBM17qv0EEP1WSbousbbnAG7i3kGDQ0NKmMG3gxX1SAYVzTa','Tukur',NULL,NULL),('student7@gmail.com','$2b$12$EbL8GOYKXvAKxeiyNvlfOeinC4C8QAPInEGGfnO0k4HfqZ7iTCEv2','Kobe',NULL,NULL),('student8@gmail.com','$2b$12$6DNz/yGHWoE90ehtg6b4TewyCC/4J.g/p9XXquIExkU6/cK.J4syu','Harden',NULL,NULL),('student9@gmail.com','$2b$12$u2ZBJXhkHmbiV/7txHqw4eYmRsAPUiz74bUPQxl3glGqtMKhH5jAu','James',NULL,NULL);
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `timetable`
--

DROP TABLE IF EXISTS `timetable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `timetable` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `time_start` varchar(50) DEFAULT NULL,
  `time_end` varchar(50) DEFAULT NULL,
  `corlor` varchar(100) DEFAULT NULL,
  `room_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timetable`
--

LOCK TABLES `timetable` WRITE;
/*!40000 ALTER TABLE `timetable` DISABLE KEYS */;
INSERT INTO `timetable` VALUES (1,'new event','2020-04-27T17:00:00.000Z','2020-04-28T16:59:59.999Z','#1e90ff',7),(2,'new event','2020-04-27T17:00:00.000Z','2020-04-28T16:59:59.999Z','#1e90ff',NULL),(3,'new event','2020-04-27T17:00:00.000Z','2020-04-28T16:59:59.999Z','#1e90ff',6),(4,'new event','2020-04-28T17:00:00.000Z','2020-04-29T16:59:00.000Z','#1e90ff',6);
/*!40000 ALTER TABLE `timetable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tutors`
--

DROP TABLE IF EXISTS `tutors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tutors` (
  `tutor_email` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `tutor_password` varchar(400) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `tutor_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `tutor_dob` date DEFAULT NULL,
  `tutor_address` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`tutor_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tutors`
--

LOCK TABLES `tutors` WRITE;
/*!40000 ALTER TABLE `tutors` DISABLE KEYS */;
INSERT INTO `tutors` VALUES ('tutor1@gmail.com','$2b$12$sPGof5TX0RAoOV.9PlFN5uAOHmBor63v/W75Jfn4g7hicawtIdnym','Ngoc',NULL,NULL),('tutor2@gmail.com','$2b$12$1G0R4OS1U/7/4F2SW5bKIuTpp5rc62sdFRb1ut9/Hp3aE97ug65Ue','Sammy',NULL,NULL),('tutor4@gmail.com','$2b$12$XesGCnmgkRhfAdHGmF6/tOHmukpG/7rxhtIfErnURS.5YYFmBFp2m','Thao',NULL,NULL);
/*!40000 ALTER TABLE `tutors` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-04-29 15:28:50
