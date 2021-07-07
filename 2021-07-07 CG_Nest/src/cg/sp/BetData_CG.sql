DROP TABLE IF EXISTS BetData_CG ;

CREATE TABLE BetData_CG(
   SerialNumber                 BIGINT UNSIGNED NOT NULL
   , GameType                   VARCHAR(32)     NOT NULL
   , LogTime                    DATETIME        NOT NULL
   , BetMoney                   DECIMAL(12, 2)  NOT NULL
   , MoneyWin                   DECIMAL(12, 2)  NOT NULL
   , NormalWin                  DECIMAL(12, 2)  NOT NULL
   , BonusWin                   DECIMAL(12, 2)  NOT NULL
   , JackpotMoney               DECIMAL(12, 2)  NOT NULL
   , ThirdPartyAccount          VARCHAR(50)     NOT NULL
   , ValidBet                   DECIMAL(12, 2)  NOT NULL
   , Device                     VARCHAR(50)     NOT NULL
   , IPAddress                  VARCHAR(50)     NOT NULL
   , WinLose                    DECIMAL(12, 2)  NOT NULL  -- MoneyWin - ValidBet
   , PRIMARY KEY(SerialNumber) 
);