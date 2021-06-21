CREATE TABLE `BetData_EVO`(
    `Id` VARCHAR(32) 
  , `startedAt` DATETIME DEFAULT NULL
  , `settledAt` DATETIME DEFAULT NULL
  , `status` VARCHAR(32) DEFAULT NULL  
  , `gameType` VARCHAR(32) DEFAULT NULL
  , `playerId` VARCHAR(32) DEFAULT NULL
  , `stake` DECIMAL(14, 4) DEFAULT NULL
  , `payout` DECIMAL(14, 4) DEFAULT NULL
  , `winlose` DECIMAL(14, 4) DEFAULT NULL  
  , `transactionId`  BIGINT UNSIGNED  DEFAULT 0 NULL NULL 
  , PRIMARY KEY(transactionId) 
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4