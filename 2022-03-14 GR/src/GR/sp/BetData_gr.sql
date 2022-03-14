CREATE TABLE BetData_GR(
    rowid                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT
    , id                  BIGINT          UNSIGNED NOT NULL
    , sid 	          VARCHAR(32)     NOT NULL
    , account             VARCHAR(32)     NOT NULL
    , game_type           INT(10)         NOT NULL    
    , game_round          BIGINT          UNSIGNED  NOT NULL    
    , bet                 DECIMAL(12, 4)  NOT NULL
    , game_result         VARCHAR(32)     NOT NULL
    , valid_bet           DECIMAL(12, 4)  NOT NULL
    , win                 DECIMAL(12, 4)  NOT NULL
    , create_time         DATETIME        NOT NULL
    , order_id            VARCHAR(50)     NOT NULL
    , device              VARCHAR(50)     NOT NULL
    , client_ip           VARCHAR(32)     NOT NULL
    , c_type              VARCHAR(32)     NOT NULL
    , profit              DECIMAL(12, 4)  NOT NULL 
   ,PRIMARY KEY(rowid)
   , KEY(sid)
);ENGINE=INNODB DEFAULT CHARSET=utf8mb4