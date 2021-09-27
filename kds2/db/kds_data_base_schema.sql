-- MySQL dump 10.13  Distrib 8.0.16, for macos10.14 (x86_64)
--
-- Host: localhost    Database: kds
-- ------------------------------------------------------
-- Server version	8.0.19

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `acquirers`
--

DROP TABLE IF EXISTS `acquirers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `acquirers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `description` varchar(256) DEFAULT NULL,
  `tag` varchar(45) NOT NULL,
  PRIMARY KEY (`id`,`tag`),
  UNIQUE KEY `tag_UNIQUE` (`tag`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `activators`
--

DROP TABLE IF EXISTS `activators`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `activators` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `description` varchar(256) DEFAULT NULL,
  `confurl` varchar(256) NOT NULL,
  `confca` mediumtext NOT NULL,
  `acquirerca` mediumtext NOT NULL,
  `kldca` mediumtext NOT NULL,
  `ip` varchar(45) NOT NULL,
  `tmsca` mediumtext NOT NULL,
  `tmscasign` mediumtext NOT NULL,
  `cmd` mediumtext,
  `activeflag` varchar(45) DEFAULT NULL,
  `modelid` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  KEY `modelid_idx` (`modelid`),
  CONSTRAINT `modelid` FOREIGN KEY (`modelid`) REFERENCES `termmodels` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `applications`
--

DROP TABLE IF EXISTS `applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `applications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `modelid` int NOT NULL,
  `name` varchar(128) NOT NULL,
  `description` varchar(256) DEFAULT NULL,
  `version` varchar(45) NOT NULL,
  `package` blob,
  `signature` varchar(256) DEFAULT NULL,
  `tag` varchar(45) NOT NULL,
  `filename` varchar(256) DEFAULT NULL,
  `typetag` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `confpacks`
--

DROP TABLE IF EXISTS `confpacks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `confpacks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `description` varchar(128) DEFAULT NULL,
  `tag` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  UNIQUE KEY `tag_UNIQUE` (`tag`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `conftemplates`
--

DROP TABLE IF EXISTS `conftemplates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `conftemplates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `stage` varchar(45) NOT NULL,
  `description` varchar(128) DEFAULT NULL,
  `xml` mediumtext NOT NULL,
  `tag` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `keyloaders`
--

DROP TABLE IF EXISTS `keyloaders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `keyloaders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `description` varchar(256) DEFAULT NULL,
  `url` varchar(256) NOT NULL,
  `sn` varchar(45) NOT NULL,
  `keytag` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `logs`
--

DROP TABLE IF EXISTS `logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` datetime NOT NULL,
  `level` varchar(10) DEFAULT NULL,
  `user` varchar(45) DEFAULT NULL,
  `message` mediumtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `merchants`
--

DROP TABLE IF EXISTS `merchants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `merchants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `mid` varchar(45) DEFAULT NULL,
  `nameandlocation` varchar(45) DEFAULT NULL,
  `description` varchar(45) DEFAULT NULL,
  `categorycode` varchar(45) DEFAULT NULL,
  `acquirerid` int DEFAULT NULL,
  `tag` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idmerchants_UNIQUE` (`id`),
  UNIQUE KEY `tag_UNIQUE` (`tag`),
  KEY `merchantacquirer_idx` (`acquirerid`),
  CONSTRAINT `merchantacquirer` FOREIGN KEY (`acquirerid`) REFERENCES `acquirers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pack_template`
--

DROP TABLE IF EXISTS `pack_template`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `pack_template` (
  `packid` int NOT NULL,
  `templateid` int NOT NULL,
  PRIMARY KEY (`packid`,`templateid`),
  KEY `pack_template_template_idx` (`templateid`),
  CONSTRAINT `pack_template_pack` FOREIGN KEY (`packid`) REFERENCES `confpacks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `pack_template_template` FOREIGN KEY (`templateid`) REFERENCES `conftemplates` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `term_group`
--

DROP TABLE IF EXISTS `term_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `term_group` (
  `termid` int NOT NULL,
  `groupid` int NOT NULL,
  PRIMARY KEY (`termid`,`groupid`),
  KEY `group_idx` (`groupid`),
  CONSTRAINT `group` FOREIGN KEY (`groupid`) REFERENCES `termgroups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `terminal` FOREIGN KEY (`termid`) REFERENCES `terminals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `termcommands`
--

DROP TABLE IF EXISTS `termcommands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `termcommands` (
  `id` int NOT NULL AUTO_INCREMENT,
  `termid` int DEFAULT NULL,
  `cmd` mediumtext,
  `result` mediumtext,
  `status` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `commandterminlkey_idx` (`termid`),
  CONSTRAINT `commandterminlkey` FOREIGN KEY (`termid`) REFERENCES `terminals` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `termgroups`
--

DROP TABLE IF EXISTS `termgroups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `termgroups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `legend` varchar(45) NOT NULL,
  `description` varchar(128) DEFAULT NULL,
  `tag` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `legend_UNIQUE` (`legend`),
  UNIQUE KEY `tag_UNIQUE` (`tag`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `terminalapplications`
--

DROP TABLE IF EXISTS `terminalapplications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `terminalapplications` (
  `terminalid` int NOT NULL,
  `appid` int NOT NULL,
  PRIMARY KEY (`appid`,`terminalid`),
  KEY `taterminals_idx` (`terminalid`),
  CONSTRAINT `atapplications` FOREIGN KEY (`appid`) REFERENCES `applications` (`id`),
  CONSTRAINT `atterminals` FOREIGN KEY (`terminalid`) REFERENCES `terminals` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `terminals`
--

DROP TABLE IF EXISTS `terminals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `terminals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `modelid` int NOT NULL,
  `sn` varchar(32) NOT NULL,
  `tid` varchar(16) DEFAULT NULL,
  `description` varchar(128) DEFAULT NULL,
  `confpackid` int DEFAULT NULL,
  `merchantid` int DEFAULT NULL,
  `stage` varchar(45) DEFAULT NULL,
  `cmd` mediumtext,
  `keyloadercert` mediumtext,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `model_sn_UNIQUE` (`modelid`,`sn`),
  KEY `termmodelskey_idx` (`modelid`),
  KEY `termina_confpack_idx` (`confpackid`),
  KEY `merchantkey_idx` (`merchantid`),
  CONSTRAINT `merchantkey` FOREIGN KEY (`merchantid`) REFERENCES `merchants` (`id`),
  CONSTRAINT `termina_confpack` FOREIGN KEY (`confpackid`) REFERENCES `confpacks` (`id`),
  CONSTRAINT `termmodelskey` FOREIGN KEY (`modelid`) REFERENCES `termmodels` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29957 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `termkeys`
--

DROP TABLE IF EXISTS `termkeys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `termkeys` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `material` mediumtext NOT NULL,
  `termid` int DEFAULT NULL,
  `keyloaderid` int DEFAULT NULL,
  `tag` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `termid_idx` (`termid`),
  KEY `keyloaderid_idx` (`keyloaderid`),
  CONSTRAINT `keyloaderid` FOREIGN KEY (`keyloaderid`) REFERENCES `keyloaders` (`id`),
  CONSTRAINT `termid` FOREIGN KEY (`termid`) REFERENCES `terminals` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `termmodels`
--

DROP TABLE IF EXISTS `termmodels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `termmodels` (
  `id` int NOT NULL,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `login` varchar(64) NOT NULL,
  `email` varchar(128) NOT NULL,
  `pwd` varchar(256) NOT NULL,
  `salt` varchar(256) NOT NULL,
  `admin` tinyint DEFAULT NULL,
  `token` varchar(256) DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `login_UNIQUE` (`login`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-04-15 16:35:30
