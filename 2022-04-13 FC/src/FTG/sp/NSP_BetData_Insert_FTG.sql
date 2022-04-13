DELIMITER $$

USE `platform_db_wrin`$$

DROP PROCEDURE IF EXISTS `NSP_BetData_Insert_FTG`$$

CREATE DEFINER=`root`@`%` PROCEDURE `NSP_BetData_Insert_FTG`(
   _id BIGINT(60) UNSIGNED
  , _bet_at DATETIME
  , _modified_at DATETIME
  , _payoff_at DATETIME
  , _round_date DATE
  , _lobby_id VARCHAR(10)
  , _game_id INT(20)
  , _game_group_id INT(20)
  , _device INT(5)
  , _device_version VARCHAR(5)
  , _bet_amount DECIMAL(14,4)
  , _profit DECIMAL(14,4)
  , _payoff DECIMAL(14,4)
  , _currency VARCHAR(10)
  , _username VARCHAR(60)
  , _result VARCHAR(5)
  , _commission DECIMAL(14,4)
  , _commissionable DECIMAL(14,4)

)
main:BEGIN
DECLARE _MemberId           INT UNSIGNED      DEFAULT 0   ;
DECLARE _GameVendor         INT               DEFAULT 71  ; -- 第三方平台編號 select * from Game_Vendor ;
DECLARE _MoneyPointRate     INT               DEFAULT 0   ;
DECLARE _MyGameType         INT               DEFAULT 2   ; -- SELECT * FROM Game_Type; ( 2:電子)
DECLARE _MyGameId           INT UNSIGNED      DEFAULT 0   ;
DECLARE _FanShuiType        CHAR(1)           DEFAULT 'E' ; 

SELECT SysValue INTO _MoneyPointRate FROM System_Value_Setup WHERE SysKey = 'MoneyPointRate' ; -- 點數與餘額的放大倍率
IF NOT EXISTS ( SELECT 1 FROM Game_List WHERE GameVendor = _GameVendor AND TheirGameId = _game_id ) -- 判斷此筆注單的遊戲編號是否已存在於我方的 game_list 中 ( 需留意 TheirGameId 為 varchar )
THEN 
    INSERT INTO Game_List  -- ID 是自動遞增的值
    SET
    GameVendor      = _GameVendor            
    , TheirGameId   = _game_id
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
    AND TheirGameId  = _game_id  ; 	-- 取回我方gameid，記錄帳務使用
SELECT UID
INTO _MemberId 
FROM Member_Info
WHERE username =_username;  	-- 取回會員uid，寫明細用的
IF (_MemberId = 0) THEN
    LEAVE main ;
END IF ;
IF NOT EXISTS 
(
    SELECT 1 
    FROM BetData_FTG
    WHERE id = _id
) 
THEN
    INSERT INTO BetData_FTG SET
    id = _id 
  , bet_at = _bet_at 
  , modified_at  = _modified_at 
  , payoff_at  = _payoff_at
  , round_date  = _round_date
  , lobby_id  = _lobby_id 
  , game_id  = _game_group_id
  , game_group_id = _game_group_id
  , device  = _device 
  , device_version = _device_version 
  , bet_amount= _bet_amount
  , profit = _profit 
  , payoff = _payoff 
  , currency = _currency
  , username  = _username
  , result  = _result 
  , commission = _commission
  , commissionable = _commissionable
	;
END IF;
	
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
            , Bet                   = _bet_amount     * _MoneyPointRate 
            , YouXiaoTouZhu         = _commissionable * _MoneyPointRate -- 有效投註( 金額 ) 電子
            , WinLose               = _profit     	  * _MoneyPointRate 
            , JPMoney               = 0               		 -- 此階段不處理
            , FanShuiRate           = 0		      		 -- 此階段不處理
            , FanShuiPoints         = 0               		 -- (此階段不處理) 週反水:寫0
            , ClientIp              = ''
            , CreateDate            = _bet_at
            , PaiCaiDate            = _modified_at       -- 無派彩時間( 改填下注時間 或 不填 ) ( 此欄位給客服參考 )
            , CheckoutDate          = UDF_Report_Winlose_Detail_CheckoutDate2(_modified_at) -- 當日帳  
       
        ;
	IF _bet_amount > 0 THEN
	    
	    UPDATE member_info
	    SET ChuKuanXianE = CASE WHEN 
		    ChuKuanXianE - (_bet_amount * _MoneyPointRate) > 0 THEN 
		    ChuKuanXianE - (_bet_amount * _MoneyPointRate) 
		ELSE 0 END             
	    WHERE uid = _MemberId ; 
		
	END IF ;
END IF ;
END$$

DELIMITER ;