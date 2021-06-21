DELIMITER $$

USE `platform_db`$$

DROP PROCEDURE IF EXISTS `NSP_BetData_Insert_JILI`$$

CREATE DEFINER=`dbtest`@`%` PROCEDURE `NSP_BetData_Insert_JILI`(
_Account		VARCHAR(50)
, _WagersId		BIGINT UNSIGNED
, _GameId		INT UNSIGNED
, _WagersTime		DATETIME
, _BetAmount    	DECIMAL(16,4)
, _PayoffTime   	DATETIME
, _PayoffAmount		DECIMAL(16,4)
, _Status		INT
, _SettlementTime	DATETIME
, _GameCategoryId 	INT
, _VersionKey		BIGINT UNSIGNED
, _Jackpot		INT
, _Type 		INT
)
main:BEGIN
DECLARE _MemberId           INT UNSIGNED      DEFAULT 0   ;
DECLARE _GameVendor         INT               DEFAULT 50  ; -- 第三方平台編號 select * from Game_Vendor ;
DECLARE _MoneyPointRate     INT               DEFAULT 0   ;
DECLARE _MyGameType         INT               DEFAULT 2   ; -- SELECT * FROM Game_Type; ( 2:電子)
DECLARE _MyGameId           INT UNSIGNED      DEFAULT 0   ;
DECLARE _FanShuiType        CHAR(1)           DEFAULT 'E' ; 
DECLARE _Win       	    DECIMAL(16,4)     DEFAULT 0	  ; 
SELECT SysValue INTO _MoneyPointRate FROM System_Value_Setup WHERE SysKey = 'MoneyPointRate' ; -- 點數與餘額的放大倍率
IF NOT EXISTS ( SELECT 1 FROM Game_List WHERE GameVendor = _GameVendor AND TheirGameId = _GameId ) -- 判斷此筆注單的遊戲編號是否已存在於我方的 game_list 中 ( 需留意 TheirGameId 為 varchar )
THEN 
    INSERT INTO Game_List  -- ID 是自動遞增的值
    SET
    GameVendor      = _GameVendor            
    , TheirGameId   = _GameId
    , GameName      = ''			-- 最後在補
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
    AND TheirGameId  = _GameId  ; 	-- 取回我方gameid，記錄帳務使用
-- 針對 _MyGameId 做報表畫分群組， 59 是由表 report_group_desc 所編排得來的。 ( 當為多群組時，應做後補動作，例 電子+補魚 )
--  74  JILI電子                                                                                                                                                                                                           
-- 	75  JILI捕魚
-- IF (_gType = 0) -- 老虎機
-- REPLACE INTO `report_group`(GroupId, GameId) VALUES(74, _MyGameId) ; 
-- IF (_gType = 7) -- 捕魚機
-- REPLACE INTO `report_group`(GroupId, GameId) VALUES(75, _MyGameId) ; 

-- 有前綴字CN_ JS幹掉了
SELECT UID
INTO _MemberId 
FROM Member_Info
WHERE username = _Account;  	-- 取回會員uid，寫明細用的
-- 判斷uid是否有效
IF (_MemberId = 0) THEN
    LEAVE main ;
END IF ;
-- 判斷此筆注單資料是否已存在於db(第三方平台注單表)中， 若「否」才做寫入動作
IF NOT EXISTS 
(
    SELECT 1 
    FROM BetData_JILI
    WHERE WagersId = _WagersId
) 
THEN
    INSERT INTO BetData_JILI SET
	`Account` = _Account	
	, WagersId = _WagersId
	, GameId = _GameId
	, WagersTime = _WagersTime
	, BetAmount = _BetAmount
	, PayoffTime = _PayoffTime
	, PayoffAmount = _PayoffAmount
	, `status` = _Status
	, SettlementTime = _SettlementTime
	, GameCategoryId = _GameCategoryId
	, VersionKey = _VersionKey
	, Jackpot = _Jackpot
	, `Type` = _Type
	;

END IF;
	 SET _Win = _PayoffAmount - _BetAmount;
-- 判斷此筆注單資料是否已存在於db(帳務明細)中， 若「否」才做寫入動作   (帳務明細: report_winlose_detail)
IF NOT EXISTS(SELECT 1 FROM report_winlose_detail WHERE GameVendor = _GameVendor AND ZhuDanId = _WagersId) THEN
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
            , ZhuDanId              = _WagersId
            , TableId 	            = 0
            , RoundCode             = ''
            , RoundId 	            = 0
            , Bet                   = _BetAmount     * _MoneyPointRate 
            , YouXiaoTouZhu         = _BetAmount     * _MoneyPointRate -- 有效投註( 金額 ) 電子
            , WinLose               = _Win     	     * _MoneyPointRate 
            , JPMoney               = 0               		 -- 此階段不處理
            , FanShuiRate           = 0		      		 -- 此階段不處理
            , FanShuiPoints         = 0               		 -- (此階段不處理) 週反水:寫0
            , ClientIp              = ''
            , CreateDate            = _WagersTime
            , PaiCaiDate            = _PayoffTime      -- 無派彩時間( 改填下注時間 或 不填 ) ( 此欄位給客服參考 )
            , CheckoutDate          = UDF_Report_Winlose_Detail_CheckoutDate2(_SettlementTime) -- 當日帳  
       
        ;
	IF _BetAmount > 0 THEN
	    
	    UPDATE member_info
	    SET ChuKuanXianE = CASE WHEN 
		    ChuKuanXianE - (_BetAmount * _MoneyPointRate) > 0 THEN 
		    ChuKuanXianE - (_BetAmount * _MoneyPointRate) 
		ELSE 0 END             
	    WHERE uid = _MemberId ; 
		
	END IF ;
END IF ;

END$$

DELIMITER ;