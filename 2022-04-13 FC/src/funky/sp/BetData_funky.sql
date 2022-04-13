CREATE TABLE BetData_Funky(
    id                 INT  UNSIGNED   NOT NULL  AUTO_INCREMENT
   ,playerId           VARCHAR(32)     NOT NULL
   ,statementDate      DATETIME        NOT NULL         
   ,betTime            DATETIME        NOT NULL
   ,refNo              VARCHAR(50)     NOT NULL
   ,betStatus          CHAR(1)         NOT NULL
   ,gameCode           VARCHAR(32)     NOT NULL
   ,gameName           VARCHAR(32)     NOT NULL
   ,currency           VARCHAR(32)     NOT NULL
   ,betAmount          DECIMAL(12, 2)  NOT NULL
   ,effectiveStake     DECIMAL(12, 2)  NOT NULL
   ,winLoss            DECIMAL(12, 2)  NOT NULL         
   ,PRIMARY KEY(id) 
   ,UNIQUE (refNo)
);ENGINE=INNODB DEFAULT CHARSET=utf8mb4
