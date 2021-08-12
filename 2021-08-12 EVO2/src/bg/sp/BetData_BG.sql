-- ,XXXX DECIMAL(20,10)
-- ,XXXX INT UNSIGNED
-- ,XXXX VARCHAR(16)
-- ,id INT UNSIGNED
-- DATETIME

CREATE OR REPLACE TABLE BetData_BG
(
    tableId VARCHAR(64)
    ,sn VARCHAR(4)
    ,uid INT UNSIGNED
    ,loginId VARCHAR(24)
    ,moduleId INT UNSIGNED
    ,moduleName VARCHAR(32)
    ,gameId VARCHAR(32)
    ,gameName VARCHAR(32)
    ,gameNameEn VARCHAR(32)
    
    ,orderStatus INT UNSIGNED

    ,bAmount DECIMAL(20,10) -- 下注額
    ,aAmount DECIMAL(20,10) -- 結算額

    ,orderFrom INT UNSIGNED
    ,orderTime DATETIME -- 下注时间
    ,lastUpdateTime DATETIME

    ,fromIp VARCHAR(32)
    ,issueId VARCHAR(32)

    ,playId VARCHAR(32)
    ,playName VARCHAR(32)
    ,playNameEn VARCHAR(32)

    ,validBet DECIMAL(20,10) -- 打码量(有效投注)
    ,validAmount DECIMAL(20,10) -- 打码量(有效投注)

    ,payment  DECIMAL(20,10) -- 派彩(输赢)

    -- ,tranId INT UNSIGNED -- ( 無值但有傳 )
    -- ,userId INT UNSIGNED -- ( 無值但有傳 )用户 ID

    ,betContent VARCHAR(16) -- ( 無值但有傳 ) 玩法內容
    ,noComm VARCHAR(16) -- ( 無值但有傳 )是否免佣.1, 免拥;0,非免拥;
    
    ,BetInfo text
    ,id BIGINT UNSIGNED -- 設值 orderId
    , PRIMARY KEY(id)
)