-- DROP TABLE BetData_EVO ;

CREATE TABLE `BetData_EVO`(
    `Id` VARCHAR(32) 
  , `startedAt` DATETIME NOT NULL
  , `settledAt` DATETIME NOT NULL
  , `status` VARCHAR(32) NOT NULL
  , `gameType` VARCHAR(32) NOT NULL
  , `playerId` VARCHAR(32) NOT NULL
  , `stake` DECIMAL(14, 4) NOT NULL
  , `payout` DECIMAL(14, 4) NOT NULL
  , `winlose` DECIMAL(14, 4) NOT NULL  
  , `transactionId`  BIGINT UNSIGNED  NOT NULL 
  , `result` VARCHAR(1024) DEFAULT '' NOT NULL
  , PRIMARY KEY(transactionId) 
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4