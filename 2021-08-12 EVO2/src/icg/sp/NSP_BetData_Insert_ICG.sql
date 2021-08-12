DELIMITER $$

USE `platform_db`$$

DROP PROCEDURE IF EXISTS `NSP_BetData_Insert_ICG`$$

CREATE DEFINER=`root`@`%` PROCEDURE `NSP_BetData_Insert_ICG`(
	_id		VARCHAR(50)
	, _createdAt 	DATETIME 
	, _updatedAt	 DATETIME 
	, _player 	VARCHAR(20) 
	, _playerId 	INT
	, _parent 	VARCHAR(11) 
	, _parentId 	INT
	, _game 	VARCHAR(20) 
	, _gameId 	VARCHAR(20) 
	, _setId 	VARCHAR(50) 
	, _productId 	VARCHAR(20) 
	, _currency 	VARCHAR(8) 
	, _gameType 	VARCHAR(6) 
	, _status 	VARCHAR(11) 
	, _win 		INT
	, _bet 		INT
	, _validBet 	INT
)
main:BEGIN
DECLARE _MemberId           INT UNSIGNED      DEFAULT 0   ;
DECLARE _GameVendor         INT               DEFAULT 53  ; -- 第三方平台編號 select * from Game_Vendor ;
DECLARE _MoneyPointRate     INT               DEFAULT 0   ;
DECLARE _MyGameType         INT               DEFAULT 2   ; -- SELECT * FROM Game_Type; ( 2:電子)
DECLARE _MyGameId           INT UNSIGNED      DEFAULT 0   ;
DECLARE _FanShuiType        CHAR(1)           DEFAULT 'E' ; 
DECLARE _WinLose       	    INT(16)           DEFAULT 0	  ; 
DECLARE _ZhuDanId           INT DEFAULT 0;  

SELECT SysValue INTO _MoneyPointRate FROM System_Value_Setup WHERE SysKey = 'MoneyPointRate' ; -- 點數與餘額的放大倍率
IF NOT EXISTS ( SELECT 1 FROM Game_List WHERE GameVendor = _GameVendor AND TheirGameId = _productId ) -- 判斷此筆注單的遊戲編號是否已存在於我方的 game_list 中 ( 需留意 TheirGameId 為 varchar )
THEN 
    INSERT INTO Game_List  -- ID 是自動遞增的值
    SET
    GameVendor      = _GameVendor            
    , TheirGameId   = _productId
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
    AND TheirGameId  = _productId  ; 	-- 取回我方gameid，記錄帳務使用

SELECT UID
INTO _MemberId 
FROM Member_Info
WHERE username = _player;  	-- 取回會員uid，寫明細用的
-- 判斷uid是否有效
IF (_MemberId = 0) THEN
    LEAVE main ;
END IF ;
-- 判斷此筆注單資料是否已存在於db(第三方平台注單表)中， 若「否」才做寫入動作

IF NOT EXISTS (SELECT 1 FROM BetData_ICG WHERE buyid_Hash = CRC32(_id) AND id = _id) 

THEN
    INSERT INTO BetData_ICG SET
	`id` = _id	
	, createdAt = _createdAt
	, updatedAt = _updatedAt
	, player = _player
	, playerId = _playerId
	, parent = _parent
	, parentId = _parentId
	, game = _game
	, gameId = _gameId
	, setId = _setId
	, productId = _productId
	, currency = _currency
	, gameType = _gameType
	, `status` = _status
	, win = _win
	, bet = _bet
	, validBet = _validBet
	,`buyid_Hash` = CRC32(_id)
	;

END IF;

SELECT `orderid` FROM BetData_ICG WHERE buyid_Hash = CRC32(_id) AND id = _id INTO _ZhuDanId;
	
SET _WinLose = _win - _validBet;	
	
-- 判斷此筆注單資料是否已存在於db(帳務明細)中， 若「否」才做寫入動作   (帳務明細: report_winlose_detail)
IF NOT EXISTS(SELECT 1 FROM report_winlose_detail WHERE GameVendor = _GameVendor AND ZhuDanId = _ZhuDanId) THEN
	IF _status = 'finish' OR 'inactive' THEN
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
            , Bet                   = _bet    	* _MoneyPointRate / 100 -- (ICG交易金額 (單位為百分之一 Credit))
            , YouXiaoTouZhu         = _validBet	* _MoneyPointRate / 100 -- (ICG交易金額 (單位為百分之一 Credit))
            , WinLose               = _WinLose	* _MoneyPointRate / 100 -- (ICG交易金額 (單位為百分之一 Credit))
            , JPMoney               = 0               		 -- 此階段不處理
            , FanShuiRate           = 0		      		 -- 此階段不處理
            , FanShuiPoints         = 0               		 -- (此階段不處理) 週反水:寫0
            , ClientIp              = ''
            , CreateDate            = _createdAt
            , PaiCaiDate            = _createdAt     -- 無派彩時間( 改填下注時間 或 不填 ) ( 此欄位給客服參考 )
            , CheckoutDate          = UDF_Report_Winlose_Detail_CheckoutDate2(_createdAt) -- 當日帳  
       
        ;
		IF _WinLose > 0 THEN
			
			UPDATE member_info
			SET ChuKuanXianE = CASE WHEN 
				ChuKuanXianE - (_validBet * _MoneyPointRate) > 0 THEN 
				ChuKuanXianE - (_validBet * _MoneyPointRate) 
			ELSE 0 END             
			WHERE uid = _MemberId ; 
			
		END IF ;
		
    END IF ;
    
	/*ELSE 

		CALL NSP_Report_Winlose_Detail_Accounting_Correct3
		(
			  _GameVendor                    	-- _GameVendor  INT    UNSIGNED
			, _ZhuDanId                      	-- _ZhuDanId    INT    UNSIGNED
			, _validBet * _MoneyPointRate / 100 									-- _NewYouXiaoTouZhu  BIGINT
			, _WinLose * _MoneyPointRate / 100      						-- _NewWinLose 
			, _createdAt                 		-- _UpdateTime  DATETIME            
		) ;  */    
END IF ;

END$$

DELIMITER ;