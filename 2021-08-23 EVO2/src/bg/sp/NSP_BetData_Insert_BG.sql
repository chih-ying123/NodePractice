DELIMITER //

CREATE OR REPLACE PROCEDURE NSP_BetData_Insert_BG(
    _tableId VARCHAR(64)
    ,_sn VARCHAR(4)
    ,_uid INT UNSIGNED
    ,_loginId VARCHAR(24)
    ,_moduleId INT UNSIGNED
    ,_moduleName VARCHAR(32)
    ,_gameId VARCHAR(32)
    ,_gameName VARCHAR(32)
    ,_gameNameEn VARCHAR(32)
    ,_orderStatus INT UNSIGNED

    ,_bAmount DECIMAL(20,10) -- 下注額
    ,_aAmount DECIMAL(20,10) -- 結算額

    ,_orderFrom INT UNSIGNED
    ,_orderTime DATETIME -- 下注时间
    ,_lastUpdateTime DATETIME

    ,_fromIp VARCHAR(32)
    ,_issueId VARCHAR(32)

    ,_playId VARCHAR(32)
    ,_playName VARCHAR(32)
    ,_playNameEn VARCHAR(32)

    ,_validBet DECIMAL(20,10) -- 打码量(有效投注)
    ,_validAmount DECIMAL(20,10) -- 打码量(有效投注)

    ,_payment  DECIMAL(20,10) -- 派彩(输赢)

    -- ,userId INT UNSIGNED -- ( 無值但有傳 )用户 ID
    -- ,_tranId INT UNSIGNED -- ( 無值但有傳 )

    ,_betContent VARCHAR(16) -- ( 無值但有傳 ) 玩法內容
    ,_noComm VARCHAR(16) -- ( 無值但有傳 )是否免佣.1, 免拥;0,非免拥;

    ,_BetInfo TEXT
    ,_id BIGINT UNSIGNED -- 設值 orderId
)
main:BEGIN

-- INSERT INTO Game_Vendor
-- SET RowId = 43
-- , VendorName = N'BG'
-- , DisableFlag = 0
-- , Description = N'BG( 真人視訊 )'
-- , VendorEName = 'BG'
-- , WalletMode = 'S' ; -- T=轉帳錢包，S=單一錢包

DECLARE _MemberId           INT UNSIGNED      DEFAULT 0   ;

DECLARE _GameVendor         INT               DEFAULT 43  ; -- 第三方平台編號 select * from Game_Vendor ;
DECLARE _MoneyPointRate     INT               DEFAULT 0   ;

DECLARE _MyGameType         INT               DEFAULT 5   ; -- SELECT * FROM Game_Type; ( 5:視訊)
DECLARE _MyGameId           INT UNSIGNED      DEFAULT 0   ;
DECLARE _FanShuiType        CHAR(1)           DEFAULT 'V' ;

SELECT SysValue FROM System_Value_Setup WHERE SysKey = 'MoneyPointRate' INTO _MoneyPointRate ; -- 點數與餘額的放大倍率

-- 判斷此筆注單的遊戲編號是否已存在於我方的 game_list 中 ( 需留意 TheirGameId 為 varchar )
IF NOT EXISTS ( SELECT 1 FROM Game_List WHERE GameVendor = _GameVendor AND TheirGameId = _gameId )
THEN 
    INSERT INTO Game_List  -- ID 是自動遞增的值
    SET
    GameVendor      = _GameVendor            
    , TheirGameId   = _gameId
    , GameName      = _gameName			-- 最後在補(有值可先加)
    , GameEName     = _gameNameEn 
    , GameType      = _MyGameType
    , FanShuiType   = _FanShuiType
    , Note          = ''
    ;
 
END IF ;


SELECT GameId        
FROM Game_List 
WHERE 
    GameVendor       = _GameVendor 
    AND TheirGameId  = _gameId 
INTO _MyGameId ; 	-- 取回我方gameid，記錄帳務使用


-- 針對 _MyGameId 做報表畫分群組， 69 是由表 report_group_desc 所編排得來的。 ( 當為多群組時，應做後補動作，例 電子+補魚 )
-- REPLACE INTO `report_group`(GroupId, GameId) VALUES(69, _MyGameId) ; 

SELECT UID
FROM Member_Info
WHERE username = _loginId
INTO _MemberId ;  	-- 取回會員uid，寫明細用的

-- 判斷uid是否有效
IF (_MemberId = 0) THEN
    LEAVE main ;
END IF ;

-- 判斷此筆注單資料是否已存在於db(第三方平台注單表)中， 若「否」才做寫入動作
IF NOT EXISTS 
(
    SELECT 1 
    FROM BetData_BG
    WHERE ID = _id
) 
THEN
    -- ,noComm=_noComm
    -- ,userId=_userId
    -- ,betContent=_betContent
    -- ,tranId=_tranId
    
    INSERT INTO BetData_BG SET
        aAmount=_aAmount
        ,loginId=_loginId
        ,id=_id
        ,moduleName=_moduleName
        ,orderStatus=_orderStatus
        ,playId=_playId
        ,uid=_uid
        ,orderTime=_orderTime
        ,gameName=_gameName
        ,payment=_payment
        ,sn=_sn
        ,bAmount=_bAmount
        ,moduleId=_moduleId
        ,gameId=_gameId
        ,playNameEn=_playNameEn
        ,issueId=_issueId
        ,playName=_playName
        ,validAmount=_validAmount
        ,gameNameEn=_gameNameEn
        ,fromIp=_fromIp
        ,tableId=_tableId
        ,orderFrom=_orderFrom
        ,validBet=_validBet
        ,lastUpdateTime=_lastUpdateTime
        ,betContent=_betContent
        ,noComm=_noComm
        ,BetInfo=_BetInfo
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
            , Bet                   = -_bAmount          * _MoneyPointRate -- 為什麼是負的，我也不知道
            , YouXiaoTouZhu         = _validBet         * _MoneyPointRate
            , WinLose               = _payment          * _MoneyPointRate
            , JPMoney               = 0               		 -- 此階段不處理
            , FanShuiRate           = 0		      		     -- 此階段不處理
            , FanShuiPoints         = 0               		 -- (此階段不處理) 週反水:寫0
            , ClientIp              = ''
            , CreateDate            = _orderTime
            , PaiCaiDate            = _lastUpdateTime -- 2020/7/24 wrin2 BG真人可使用這個參數，「最后修改时间 lastUpdateTime」作為派彩時間，請協助修正 by mk LIZZIE
            , CheckoutDate          = UDF_Report_Winlose_Detail_CheckoutDate() -- 隔日帳    
        ;

	IF _bAmount > 0 THEN
	    
	    UPDATE member_info
	    SET ChuKuanXianE = CASE WHEN  
		    ChuKuanXianE - (_bAmount * _MoneyPointRate) > 0 THEN 
		    ChuKuanXianE - (_bAmount * _MoneyPointRate) 
		ELSE 0 END             
	    WHERE uid = _MemberId ; 
		
	END IF ;

END IF ;

END //