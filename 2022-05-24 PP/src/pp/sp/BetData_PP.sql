CREATE OR REPLACE TABLE BetData_PP(
    playerID               BIGINT          UNSIGNED NOT NULL 
    , extPlayerID          VARCHAR(100)    NOT NULL
    , gameID 	           VARCHAR(20)     NOT NULL
    , playSessionID        BIGINT          UNSIGNED NOT NULL
    , parentSessionID      BIGINT          UNSIGNED     
    , startDate            DATETIME        NOT NULL    
    , endDate              DATETIME        NOT NULL
    , `status`             CHAR(1)         NOT NULL
    , `type`               CHAR(1)         NOT NULL
    , bet                  DECIMAL(15, 2)  NOT NULL
    , win                  DECIMAL(15, 2)  NOT NULL
    , currency             VARCHAR(5)         NOT NULL
    , jackpot              DECIMAL(15, 2)  NOT NULL
    , roundDetails         TEXT     
    , winlose              DECIMAL(15, 2)  NOT NULL
    , GameType             TINYINT         NOT NULL
    , FanShuiType          CHAR(1)         NOT NULL
   ,PRIMARY KEY(playSessionID)
)ENGINE=INNODB DEFAULT CHARSET=utf8mb4;