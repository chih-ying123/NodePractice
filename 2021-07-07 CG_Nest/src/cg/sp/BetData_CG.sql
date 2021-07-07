CREATE TABLE `BetData_CG`(
    `Id`        VARCHAR(32) 
  , `GameType`  VARCHAR(32)      DEFAULT NULL
  , `LogTime`   DATETIME         DEFAULT NULL
  , `playerId`  VARCHAR(32)      DEFAULT NULL
  , `wager`     DECIMAL(14, 4)   DEFAULT NULL
  , `payout`    DECIMAL(14, 4)   DEFAULT NULL
  , `winlose`   DECIMAL(14, 4)   DEFAULT NULL
  , `normalWin` DECIMAL(14, 4)   DEFAULT NULL
  , `bonusWin`  DECIMAL(14, 4)   DEFAULT NULL
  , PRIMARY KEY(Id) 
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4