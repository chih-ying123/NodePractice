CREATE OR REPLACE TABLE BetData_SBO_Sport
(
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `refNo` varchar(32) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `sportType` varchar(32) DEFAULT NULL,
  `orderTime` datetime DEFAULT NULL,
  `winlostDate` datetime DEFAULT NULL,
  `modifyDate` datetime DEFAULT NULL,
  `odds` decimal(20,10) DEFAULT NULL,
  `oddsStyle` varchar(10) DEFAULT NULL,
  `stake` decimal(20,10) DEFAULT NULL,
  `actualStake` decimal(20,10) DEFAULT NULL,
  `currency` varchar(10) DEFAULT NULL,
  `status` varchar(30) DEFAULT NULL,
  `winlose` decimal(20,10) DEFAULT NULL,
  `turnover` decimal(20,10) DEFAULT NULL,
  `isHalfWonLose` tinyint(4) DEFAULT NULL,
  `isLive` tinyint(4) DEFAULT NULL,
  `maxWinWithoutActualStake` decimal(20,10) DEFAULT NULL,
  `ip` varchar(32) DEFAULT NULL,
  `subBet` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `BetInfo` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=432 DEFAULT CHARSET=utf8mb4