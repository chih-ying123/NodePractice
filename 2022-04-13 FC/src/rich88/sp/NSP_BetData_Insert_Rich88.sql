DELIMITER $$

USE `platform_db_wrv`$$

DROP PROCEDURE IF EXISTS `NSP_BetData_Insert_Rich88`$$

CREATE DEFINER=`root`@`%` PROCEDURE `NSP_BetData_Insert_Rich88`(
  _record_id TEXT
  ,_created_at DATETIME 
  ,_updated_at DATETIME 
  ,_game_code VARCHAR(60) 
  ,_account VARCHAR(60) 
  ,_bet_status VARCHAR(2) 
  ,_base_bet DECIMAL(14,4) 
  ,_bet DECIMAL(14,4) 
  ,_bet_valid DECIMAL(14,4) 
  ,_profit DECIMAL(14,4) 
  ,_tax DECIMAL(14,4) 
  ,_balance DECIMAL(14,4) 
  ,_bonus DECIMAL(14,4) 
  ,_result TEXT 
  ,_round_id TEXT 
  ,_round_start_at DATETIME 
  ,_round_end_at DATETIME 
  ,_currency VARCHAR(5) 
  ,_category VARCHAR(60) 
)
main:BEGIN


DECLARE _MemberId           INT UNSIGNED      DEFAULT 0   ;

DECLARE _GameVendor         INT               DEFAULT 75  ; -- 第三方平台編號 select * from Game_Vendor ;
DECLARE _GroupId         	INT               DEFAULT 105  ; 
DECLARE _MoneyPointRate     INT               DEFAULT 0   ;

DECLARE _MyGameType         INT               DEFAULT 3   ; -- SELECT * FROM Game_Type; ( 3:多人)
DECLARE _MyGameId           INT UNSIGNED      DEFAULT 0   ;
DECLARE _FanShuiType        CHAR(1)           DEFAULT 'M' ;
DECLARE _ZhuDanId           BIGINT UNSIGNED   DEFAULT 0  ;



IF _created_at < '2021-06-01 00:00:00'
THEN
	LEAVE main;
END IF;

SELECT SysValue FROM System_Value_Setup WHERE SysKey = 'MoneyPointRate' INTO _MoneyPointRate ; -- 點數與餘額的放大倍率

-- 判斷此筆注單的遊戲編號是否已存在於我方的 game_list 中


IF NOT EXISTS ( SELECT 1 FROM Game_List WHERE GameVendor = _GameVendor AND TheirGameId = _game_code )
THEN 

    INSERT INTO Game_List  -- ID 是自動遞增的值
    SET
    GameVendor      = _GameVendor            
    , TheirGameId   = _game_code
    , GameName      = ''			-- 最後在補
    , GameType      = _MyGameType
    , FanShuiType   = _FanShuiType
    , Note          = ''
    ;
    
END IF ;


SELECT GameId        
FROM Game_List 
WHERE 
    GameVendor       = _GameVendor 
    AND TheirGameId  = _game_code 
INTO _MyGameId ; 	-- 取回我方gameid，記錄帳務使用


-- 針對 _MyGameId 做報表畫分群組， 64 是由表 report_group_desc 所編排得來的。 ( 當為多群組時，應做後補動作，例 電子+補魚 )
-- REPLACE INTO `report_group`(GroupId, GameId) VALUES(64, _MyGameId) ; 

SELECT UID
FROM Member_Info
WHERE username = _account
INTO _MemberId ;  	-- 取回會員uid，寫明細用的

-- 判斷uid是否有效
IF (_MemberId = 0) THEN
    LEAVE main ;
END IF ;

-- 判斷此筆注單資料是否已存在於db(第三方平台注單表)中， 若「否」才做寫入動作
IF NOT EXISTS 
(
    SELECT 1 
    FROM betdata_rich88
    WHERE record_id_hash = CRC32(_record_id) AND record_id = _record_id
) 
THEN

    INSERT INTO betdata_rich88 
    SET
	    record_id_hash = CRC32(_record_id)
	    ,record_id =_record_id 
	    ,created_at  =_created_at  
	    ,updated_at  =_updated_at  
	    ,game_code =_game_code 
	    ,account =_account 
	    ,bet_status =_bet_status 
	    ,base_bet  =_base_bet  
	    ,bet  =_bet  
	    ,bet_valid  =_bet_valid  
	    ,profit  =_profit  
	    ,tax  =_tax  
	    ,balance  =_balance  
	    ,bonus  =_bonus  
	    ,result =_result 
	    ,round_id =_round_id 
	    ,round_start_at  =_round_start_at  
	    ,round_end_at  =_round_end_at  
	    ,currency =_currency 
	    ,category =_category;   
ELSE
	UPDATE betdata_rich88
	SET 
	    created_at  =_created_at  
	    ,updated_at  =_updated_at  
	    ,game_code =_game_code 
	    ,account =_account 
	    ,bet_status =_bet_status 
	    ,base_bet  =_base_bet  
	    ,bet  =_bet  
	    ,bet_valid  =_bet_valid  
	    ,profit  =_profit  
	    ,tax  =_tax  
	    ,balance  =_balance  
	    ,bonus  =_bonus  
	    ,result =_result 
	    ,round_id =_round_id 
	    ,round_start_at  =_round_start_at  
	    ,round_end_at  =_round_end_at  
	    ,currency =_currency 
	    ,category =_category  
	WHERE
	record_id_hash = CRC32(_record_id) AND record_id = _record_id;	 
END IF;



SELECT orderid INTO _ZhuDanId FROM betdata_rich88 WHERE record_id_hash = CRC32(_record_id) AND record_id = _record_id;
	
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
            , Bet                   = _bet        * _MoneyPointRate 
            , YouXiaoTouZhu         = _bet_valid    	* _MoneyPointRate 
            , WinLose               = _profit        	* _MoneyPointRate 
            , JPMoney               = 0               		 -- 此階段不處理
            , FanShuiRate           = 0		      		     -- 此階段不處理
            , FanShuiPoints         = 0               		 -- (此階段不處理) 週反水:寫0
            , ClientIp              = ''
            , CreateDate            = _created_at
            , PaiCaiDate            = _updated_at              -- 無派彩時間( 改填下注時間 或 不填 ) ( 此欄位給客服參考 )
            , CheckoutDate          = UDF_Report_Winlose_Detail_CheckoutDate2(_created_at) -- 隔日帳    
        ;

	IF _profit > 0 THEN
	    
	    UPDATE member_info
	    SET ChuKuanXianE = CASE WHEN   
		    ChuKuanXianE - (_profit * _MoneyPointRate) > 0 THEN 
		    ChuKuanXianE - (_profit * _MoneyPointRate) 
		ELSE 0 END             
	    WHERE uid = _MemberId ; 
		
	END IF ;

END IF ;

END$$

DELIMITER ;