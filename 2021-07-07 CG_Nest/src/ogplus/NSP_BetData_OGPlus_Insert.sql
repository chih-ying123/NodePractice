DELIMITER //

CREATE OR REPLACE PROCEDURE NSP_BetData_OGPlus_Insert
(
      _id                    BIGINT UNSIGNED 
    , _membername            VARCHAR(50)
    , _gamename              VARCHAR(128)
    , _bettingcode           VARCHAR(32)
    , _bettingdate           DATETIME
    , _gameid                VARCHAR(64)
    , _roundno               VARCHAR(64)
    , _game_information      VARCHAR(1024)    
    , _result                VARCHAR(64)
    , _bet                   VARCHAR(64)
    , _winloseresult         VARCHAR(64)
    , _bettingamount         DECIMAL(20,10)
    , _validbet              DECIMAL(20,10)
    , _winloseamount         DECIMAL(20,10)
    , _balance               DECIMAL(20,10)
    , _currency              VARCHAR(64)
    , _handicap              VARCHAR(64)
    , _status                VARCHAR(64)
    , _gamecategory          VARCHAR(64)
    , _settledate            VARCHAR(64)
    , _remark                VARCHAR(64)
    , _vendor_id             VARCHAR(64)
)
main:BEGIN

    DECLARE _MemberId           INT UNSIGNED      DEFAULT 0   ;
    DECLARE _GameVendor         INT               DEFAULT 32  ; -- 第三方平台編號 select * from Game_Vendor ;
    DECLARE _MoneyPointRate     INT               DEFAULT 0   ;
    DECLARE _MyGameType         INT               DEFAULT 5   ; -- SELECT * FROM Game_Type; ( 2:電子)
    DECLARE _MyGameId           INT UNSIGNED      DEFAULT 0   ;
    DECLARE _FanShuiType        CHAR(1)           DEFAULT 'V' ; 
    
    SELECT SysValue FROM System_Value_Setup WHERE SysKey = 'MoneyPointRate' INTO _MoneyPointRate ; -- 點數與餘額的放大倍率
    
    IF NOT EXISTS ( SELECT 1 FROM Game_List WHERE GameVendor = _GameVendor AND TheirGameId = _gameId ) -- 判斷此筆注單的遊戲編號是否已存在於我方的 game_list 中 ( 需留意 TheirGameId 為 varchar )
    THEN 

        INSERT INTO Game_List  -- ID 是自動遞增的值
        SET
            GameVendor      = _GameVendor            
            , TheirGameId   = _gameid
            , GameName      = _gamename			-- 最後在補
            , GameType      = _MyGameType
            , FanShuiType   = _FanShuiType
            , Note          = _gamecategory
            ;
        
    END IF ;
    
    
    SELECT GameId        
    FROM Game_List 
    WHERE 
        GameVendor       = _GameVendor 
        AND TheirGameId  = _gameId 
    INTO _MyGameId ; 	-- 取回我方gameid，記錄帳務使用
    
    -- 帳號有前綴    (js幹掉了)
    SELECT UID
    FROM Member_Info
    WHERE username = _membername
    INTO _MemberId ;  	-- 取回會員uid，寫明細用的    
    
    -- 判斷uid是否有效
    IF (_MemberId = 0) THEN
        LEAVE main ;
    END IF ;
    
    IF NOT EXISTS 
    (
        SELECT 1 
        FROM BetData_OGPlus
        WHERE ID = _id
    ) 
    THEN
    
        INSERT INTO BetData_OGPlus
        SET
            id         = _id                
            , membername = _membername        
            , gamename = _gamename
            , bettingcode = _bettingcode
            , bettingdate = _bettingdate
            , gameid = _gameid
            , roundno = _roundno
            , game_information = _game_information
            , result = _result
            , bet = _bet
            , winloseresult = _winloseresult
            , bettingamount = _bettingamount
            , validbet = _validbet
            , winloseamount= _winloseamount
            , balance = _balance
            , currency = _currency
            , handicap = _handicap
            , `status` = _status
            , gamecategory = _gamecategory
            , settledate = _settledate
            , remark = _remark
            , vendor_id = _vendor_id
        ;
    
    
    END IF;
    
    
    -- 判斷此筆注單資料是否已存在於db(帳務明細)中， 若「否」才做寫入動作   (帳務明細: report_winlose_detail)
    IF NOT EXISTS(SELECT 1 FROM report_winlose_detail WHERE GameVendor = _GameVendor AND ZhuDanId = _id) THEN
    
        INSERT INTO report_winlose_detail
        SET
              MemberId              = _MemberId
            , UpId_L1               = UDF_Get_Upper_Member_ID(_MemberId, 1)
            , UpId_L2               = UDF_Get_Upper_Member_ID(_MemberId, 2)
            , UpId_L3               = UDF_Get_Upper_Member_ID(_MemberId, 3)
            , UpId_L4               = UDF_Get_Upper_Member_ID(_MemberId, 4)
            , CommissionRate_L1     = UDF_Get_Upper_Member_CommissonRate(_MemberId, 1, _FanShuiType)
            , CommissionRate_L2     = UDF_Get_Upper_Member_CommissonRate(_MemberId, 2, _FanShuiType)           
            , CommissionRate_L3     = UDF_Get_Upper_Member_CommissonRate(_MemberId, 3, _FanShuiType)           
            , CommissionRate_L4     = UDF_Get_Upper_Member_CommissonRate(_MemberId, 4, _FanShuiType)
            , GameVendor            = _GameVendor
            , GameType              = _MyGameType
            , GameId 	            = _MyGameId 
            , ZhuDanId              = _id
            , TableId 	            = 0
            , RoundCode             = ''
            , RoundId 	            = 0
            , Bet                   = _bettingamount  * _MoneyPointRate 
            , YouXiaoTouZhu         = _validbet       * _MoneyPointRate -- 有效投註( 金額 ) 電子
            , WinLose               = _winloseamount  * _MoneyPointRate 
            , JPMoney               = 0                  -- 此階段不處理
            , FanShuiRate           = 0		      		 -- 此階段不處理
            , FanShuiPoints         = 0               	 -- (此階段不處理) 週反水:寫0
            , ClientIp              = ''
            , CreateDate            = _bettingdate
            , PaiCaiDate            = _bettingdate       -- 無派彩時間( 改填下注時間 或 不填 ) ( 此欄位給客服參考 )
            , CheckoutDate          = CURRENT_TIMESTAMP    
        ;
        
        
        IF _bet > 0 THEN
	    
            UPDATE member_info
            SET ChuKuanXianE = CASE WHEN 
                ChuKuanXianE - (_validbet * _MoneyPointRate) > 0 THEN 
                ChuKuanXianE - (_validbet * _MoneyPointRate) 
            ELSE 0 END             
            WHERE uid = _MemberId ; 
		
        END IF ;

    
    
    END IF ;


END //