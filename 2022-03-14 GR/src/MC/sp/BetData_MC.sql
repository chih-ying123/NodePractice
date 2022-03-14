CREATE TABLE BetData_MC(
      id                  INT(10) UNSIGNED NOT NULL AUTO_INCREMENT
    , bet_id 	          VARCHAR(32)     NOT NULL
    , game_code           VARCHAR(32)     NOT NULL
    , game_name           VARCHAR(32)     NOT NULL
    , game_type           INT(10)         NOT NULL
    , game_type_name      VARCHAR(32)     NOT NULL
    , `field`             VARCHAR(32)     NOT NULL
    , account             VARCHAR(32)     NOT NULL
    , bet_valid           DECIMAL(12, 4)  NOT NULL
    , bet_amount          DECIMAL(12, 4)  NOT NULL
    , got_amount          DECIMAL(12, 4)  NOT NULL
    , win_amount          DECIMAL(12, 4)  NOT NULL
    , lose_amount         DECIMAL(12, 4)  NOT NULL
    , bet_content         VARCHAR(1024)     NOT NULL
    , content             VARCHAR(1024)     NOT NULL
    , result              VARCHAR(1024)     NOT NULL
    , payoff              DECIMAL(12, 4)  NOT NULL
    , payoff_at           DATETIME        NOT NULL 
    , feedback            DECIMAL(12, 4)  NOT NULL
    , wash                DECIMAL(12, 4)  NOT NULL
    , pca_contribute      DECIMAL(12, 4)  NOT NULL
    , pca_win             DECIMAL(12, 4)  NOT NULL
    , revenue             DECIMAL(12, 4)  NOT NULL
    , `status`            TINYINT(1)      NOT NULL
    , winlose             DECIMAL(12, 4)  NOT NULL
   ,PRIMARY KEY(id)
   
);ENGINE=INNODB DEFAULT CHARSET=utf8mb4