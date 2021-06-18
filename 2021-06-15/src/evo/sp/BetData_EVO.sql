CREATE TABLE `BetData_EVO`(
    `Id` varchar(32) PRIMARY KEY
  , `startedAt` datetime DEFAULT NULL
  , `settledAt` datetime DEFAULT NULL
  , `status` varchar(32) DEFAULT NULL
  , `playerId` varchar(32) DEFAULT NULL
  , `wager` decimal(14, 4) DEFAULT NULL
  , `payout` decimal(14, 4) DEFAULT NULL
  , `winlose` decimal(14, 4) DEFAULT NULL  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4