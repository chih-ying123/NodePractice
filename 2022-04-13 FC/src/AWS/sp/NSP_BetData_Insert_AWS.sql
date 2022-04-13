DELIMITER $$

USE `platform_db`$$

DROP PROCEDURE IF EXISTS `NSP_BetData_Insert_AWS`$$

CREATE DEFINER=`root`@`%` PROCEDURE `NSP_BetData_Insert_AWS`(
  _username		VARCHAR(64),
  _orderId 		INT(64),
  _stake 		DECIMAL(18,2),
  _bet			DECIMAL(18,2),
  _win 			DECIMAL(18,2) ,
  _balanceBefore 	DECIMAL(18,2),
  _balanceAfter 	DECIMAL(18,2),
  _operationType	VARCHAR(32),
  _operationId 		INT(5),
  _betTime 		DATETIME,
  _cnGameName 		VARCHAR(64),
  _enGameName 		VARCHAR(64),
  _device 		INT(5),
  _gameId 		VARCHAR(32),
  _finalView 		TEXT,
  _txnId		VARCHAR(128),
  _currency 		VARCHAR(32)
)
main:BEGIN
DECLARE _MemberId           INT UNSIGNED      DEFAULT 0   ;
DECLARE _GameVendor         INT               DEFAULT 62  ; -- 第三方平台編號 select * from Game_Vendor ;
DECLARE _MoneyPointRate     INT               DEFAULT 0   ;
DECLARE _MyGameType         INT               DEFAULT 2   ; -- SELECT * FROM Game_Type; ( 2:電子)
DECLARE _MyGameId           INT UNSIGNED      DEFAULT 0   ;
DECLARE _FanShuiType        CHAR(1)           DEFAULT 'E' ; 
DECLARE _WinLose       	    INT(16)           DEFAULT 0	  ; 
DECLARE _ZhuDanId           INT DEFAULT 0;  

SELECT SysValue INTO _MoneyPointRate FROM System_Value_Setup WHERE SysKey = 'MoneyPointRate' ; -- 點數與餘額的放大倍率
IF NOT EXISTS ( SELECT 1 FROM Game_List WHERE GameVendor = _GameVendor AND TheirGameId = _gameId ) -- 判斷此筆注單的遊戲編號是否已存在於我方的 game_list 中 ( 需留意 TheirGameId 為 varchar )
THEN 
    INSERT INTO Game_List  -- ID 是自動遞增的值
    SET
    GameVendor      = _GameVendor            
    , TheirGameId   = _gameId
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
    AND TheirGameId  = _gameId  ; 	-- 取回我方gameid，記錄帳務使用

SELECT UID
INTO _MemberId 
FROM Member_Info
WHERE username = _username;  	-- 取回會員uid，寫明細用的
-- 判斷uid是否有效
IF (_MemberId = 0) THEN
    LEAVE main ;
END IF ;
-- 判斷此筆注單資料是否已存在於db(第三方平台注單表)中， 若「否」才做寫入動作

IF NOT EXISTS (SELECT 1 FROM BetData_AWS WHERE orderid_Hash = CRC32(_orderid) AND orderid = _orderid) 

THEN
    INSERT INTO BetData_AWS SET
	  username = _username	
	, orderId = _orderId
	, stake = _stake
	, bet = _bet
	, win = _win
	, balanceBefore = _balanceBefore
	, balanceAfter = _balanceAfter
	, operationType = _operationType
	, operationId = _operationId
	, betTime = _betTime
	, cnGameName = _cnGameName
	, enGameName = _enGameName
	, device = _device
	, gameId = _gameId
	, finalView = _finalView
	, txnId = _txnId
	, currency = _currency
	,`orderId_Hash` = CRC32(_orderId)
	;

END IF;

SELECT `Rowid` FROM BetData_AWS WHERE orderId_Hash = CRC32(_orderId) AND orderId = _orderId INTO _ZhuDanId;
	
SET _WinLose = _win - _bet;	
	
-- 判斷此筆注單資料是否已存在於db(帳務明細)中， 若「否」才做寫入動作   (帳務明細: report_winlose_detail)
IF NOT EXISTS(SELECT 1 FROM report_winlose_detail WHERE GameVendor = _GameVendor AND ZhuDanId = _ZhuDanId) THEN
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
            , ZhuDanId              = _ZhuDanId
            , TableId 	            = 0
            , RoundCode             = ''
            , RoundId 	            = 0
            , Bet                   = _bet    	* _MoneyPointRate 
            , YouXiaoTouZhu         = _bet	    * _MoneyPointRate 
            , WinLose               = _WinLose	* _MoneyPointRate
            , JPMoney               = 0               		 -- 此階段不處理
            , FanShuiRate           = 0		      		     -- 此階段不處理
            , FanShuiPoints         = 0               		 -- (此階段不處理) 週反水:寫0
            , ClientIp              = ''
            , CreateDate            = _betTime
            , PaiCaiDate            = _betTime     -- 無派彩時間( 改填下注時間 或 不填 ) ( 此欄位給客服參考 )
            , CheckoutDate          = UDF_Report_Winlose_Detail_CheckoutDate2(_betTime) -- 當日帳  
       
        ;
		IF _WinLose > 0 THEN
			
			UPDATE member_info
			SET ChuKuanXianE = CASE WHEN 
				ChuKuanXianE - (_bet * _MoneyPointRate) > 0 THEN 
				ChuKuanXianE - (_bet * _MoneyPointRate) 
			ELSE 0 END             
			WHERE uid = _MemberId ; 
			
		END IF ;
		
END IF ;

END$$

DELIMITER ;