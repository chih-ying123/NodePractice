CREATE TABLE BetData_FC(
    bet              DECIMAL(12, 2)  NOT NULL
    , prize          DECIMAL(12, 2)  NOT NULL
    , winlose        DECIMAL(12, 2)  NOT NULL
    , `before`       DECIMAL(12, 2)  NOT NULL
    , `after`        DECIMAL(12, 2)  NOT NULL
    , jptax          DECIMAL(12, 6)  NOT NULL
    , jppoints       DECIMAL(12, 2)  NOT NULL
    , recordID       BIGINT          UNSIGNED
    , account        VARCHAR(32)     NOT NULL
    , gameID         INT(10)         NOT NULL
    , gametype       INT(5)          NOT NULL
    , jpmode          INT(5)          NOT NULL
    , bdate           DATETIME        NOT NULL    
    , PRIMARY KEY(recordID)
);ENGINE=INNODB DEFAULT CHARSET=utf8mb4