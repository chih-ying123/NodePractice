DROP TABLE IF EXISTS BetData_OGPlus ;

CREATE TABLE BetData_OGPlus
(
    id                      BIGINT UNSIGNED 
    , membername            VARCHAR(50)
    , gamename              VARCHAR(128)
    , bettingcode           VARCHAR(32)
    , bettingdate           DATETIME
    , gameid                VARCHAR(64)
    , roundno               VARCHAR(64)
    , game_information      VARCHAR(1024)    
    , result                VARCHAR(64)
    , bet                   VARCHAR(64)
    , winloseresult         VARCHAR(64)
    , bettingamount         DECIMAL(20,10)
    , validbet              DECIMAL(20,10)
    , winloseamount         DECIMAL(20,10)
    , balance               DECIMAL(20,10)
    , currency              VARCHAR(64)
    , handicap              VARCHAR(64)
    , `status`              VARCHAR(64)
    , gamecategory          VARCHAR(64)
    , settledate            VARCHAR(64)
    , remark                VARCHAR(64)
    , vendor_id             VARCHAR(64)
    , PRIMARY KEY(id)
    , INDEX IX_1(membername, bettingdate)
) ;

/*
WRC
    INSERT INTO Game_Vendor SET RowId = 32, VendorName = 'OGPlus', VendorEName = 'OGPlus' ;

    INSERT INTO Report_Group_Desc 
    SET 
        GroupId = 50
        , Depiction=N'OGPlus視訊'
        , sqlStr = 'INSERT INTO report_group (GroupId, GameId) SELECT 50, GameId FROM Game_List WHERE GameVendor = 32 AND GameType = 5;' ;
    
    -- DELETE FROM game_list WHERE GameName = N'OGPlus視訊返水' ;
    INSERT INTO game_list 
        SET GameName = N'OGPlus視訊返水' 
        , GameType = 5
        , FanshuiType='V'
        , Theirgameid = 'ReportGroupID_50'
        , GameVendor = 32
        , Note ='FanShui';
        
        
            
    UDF_Report_GetBetInfo
    ELSEIF _GameId IN(SELECT GameId FROM Game_List WHERE GameVendor = 32) THEN        
        SELECT game_information FROM BetData_OGPlus WHERE Id = _ZhuDanId INTO _BetInfo ;
        
*/



