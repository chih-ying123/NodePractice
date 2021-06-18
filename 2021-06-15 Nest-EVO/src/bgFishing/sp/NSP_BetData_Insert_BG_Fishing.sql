DELIMITER $$

USE `platform_db`$$

DROP PROCEDURE IF EXISTS `NSP_BetData_Insert_BG_Fishing`$$

CREATE DEFINER=`root`@`%` PROCEDURE `NSP_BetData_Insert_BG_Fishing`(
 
    _sn VARCHAR(4)
    ,_userId VARCHAR(64)
    ,_loginId VARCHAR(24)
    ,_issueId VARCHAR(32)
    ,_betId VARCHAR(32)
    ,_gameBalance DECIMAL(20,10)
    ,_fireCount VARCHAR(32)
    ,_betAmount VARCHAR(32)
    ,_validAmount DECIMAL(20,10) 
    ,_calcAmount DECIMAL(20,10) 
    ,_payout DECIMAL(20,10) 
    ,_orderTime   DATETIME
    ,_orderFrom INT UNSIGNED
    ,_jackpot  VARCHAR(16) 
    ,_extend  VARCHAR(16)
    ,_jackpotType INT (32)
    ,_gameType INT (32)
    ,_orderTimeBj DATETIME
    ,_id BIGINT(32)
  
)
main:BEGIN
DECLARE _MemberId           INT UNSIGNED      DEFAULT 0   ;
DECLARE _GameVendor         INT               DEFAULT 50  ; -- 第三方平台編號 select * from Game_Vendor ;
DECLARE _MoneyPointRate     INT               DEFAULT 0   ;
DECLARE _MyGameType         INT               DEFAULT 2   ; -- SELECT * FROM Game_Type; ( 2:電子)
DECLARE _MyGameId           INT UNSIGNED      DEFAULT 0   ;
DECLARE _FanShuiType        CHAR(1)           DEFAULT 'V' ;
DECLARE _FanShuiFlag        TINYINT DEFAULT 1;	

SELECT SysValue INTO _MoneyPointRate FROM System_Value_Setup WHERE SysKey = 'MoneyPointRate' ; -- 點數與餘額的放大倍率
IF NOT EXISTS ( SELECT 1 FROM Game_List WHERE GameVendor = _GameVendor AND TheirGameId = _gameType )
THEN 
    INSERT INTO Game_List  -- ID 是自動遞增的值
    SET
    GameVendor      = _GameVendor            
    , TheirGameId   = _gameType
    , GameName      = _gameName			-- 最後在補(有值可先加)
    , GameEName     = _gameNameEn 
    , GameType      = _MyGameType
    , FanShuiType   = _FanShuiType
    , Note          = ''
    ;
 
END IF ;
SELECT GameId
INTO _MyGameId
FROM Game_List 
WHERE 
    GameVendor       = _GameVendor 
    AND TheirGameId  = _gameType  ; 	-- 取回我方gameid，記錄帳務使用

SELECT UID
INTO _MemberId 
FROM Member_Info
WHERE username =_loginId; 	-- 取回會員uid，寫明細用的
-- 判斷uid是否有效
IF (_MemberId = 0) THEN
    LEAVE main ;
END IF ;

IF NOT EXISTS 
(
    SELECT 1 
    FROM betdata_bg_fishing
    WHERE betId = _betId
) 
THEN
    INSERT INTO betdata_bg_fishing SET
     sn = _sn 
    , userId = _userId 
    , loginId  = _loginId 
    , issueId =_issueId 
    , betId =_betId 
    , gameBalance =_gameBalance 
    , fireCount =_fireCount 
    , betAmount =_betAmount 
    , validAmount =_validAmount 
    , calcAmount =_calcAmount 
    , payout=_payout 
    , orderTime =_orderTime   
    , orderTimeBj=_orderTimeBj 
    , orderFrom =_orderFrom 
    , jackpot=_jackpot  
    , extend =_extend  
    , jackpotType =_jackpotType 
    , gameType=_gameType
    , id = _id
    ;
END IF;
	
IF NOT EXISTS(SELECT 1 FROM report_winlose_detail WHERE GameVendor = _GameVendor AND ZhuDanId = _betId) THEN
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
            , ZhuDanId              = _Id
            , TableId 	            = 0
            , RoundCode             = ''
            , RoundId 	            = 0
            , Bet                   = _betAmount        * _MoneyPointRate 
            , YouXiaoTouZhu         = _validAmount      * _MoneyPointRate
            , WinLose               = _payout           * _MoneyPointRate
            , JPMoney               = 0               		 -- 此階段不處理
            , FanShuiRate           = 0		      		     -- 此階段不處理
            , FanShuiPoints         = 0               		 -- (此階段不處理) 週反水:寫0
            , ClientIp              = ''
            , CreateDate            = _orderTimeBj
            , PaiCaiDate            = _orderTimeBj 
            , CheckoutDate          = UDF_Report_Winlose_Detail_CheckoutDate2(_orderTimeBj) -- 當日帳    
            , FanShuiFlag 	        = _FanShuiFlag 
        ;
	IF _betAmount > 0 THEN
	    
	    UPDATE member_info
	    SET ChuKuanXianE = CASE WHEN  
		ChuKuanXianE - (_betAmount * _MoneyPointRate) > 0 THEN 
		ChuKuanXianE - (_betAmount * _MoneyPointRate) 
		ELSE 0 END             
	    WHERE uid = _MemberId ; 
		
	END IF ;
END IF ;
END$$

DELIMITER ;