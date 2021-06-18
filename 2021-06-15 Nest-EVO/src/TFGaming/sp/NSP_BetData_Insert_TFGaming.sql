DELIMITER $$

USE `platform_db`$$

DROP PROCEDURE IF EXISTS `NSP_betdata_insert_tfgaming`$$

CREATE DEFINER=`root`@`%` PROCEDURE `NSP_betdata_insert_tfgaming`(  
  _id VARCHAR(64),
  _bet_selection VARCHAR(64),
  _odds DECIMAL(24,2),
  _currency VARCHAR(4),
  _amount DECIMAL(20,10),
  _game_type_name VARCHAR(32),
  _game_market_name VARCHAR(255),
  _market_option VARCHAR(10),
  _map_num VARCHAR(20),
  _bet_type_name VARCHAR(10),
  _competition_name VARCHAR(255),
  _event_id INT(10),
  _event_name VARCHAR(255),
  _event_datetime DATETIME,
  _date_created DATETIME,
  _settlement_datetime DATETIME,
  _modified_datetime DATETIME,
  _settlement_status VARCHAR(20),
  _result VARCHAR(255),
  _result_status VARCHAR(32),
  _earnings DECIMAL(20,10),
  _handicap DECIMAL(20,10),
  _is_combo TINYINT(1),
  _member_code VARCHAR(255),
  _is_unsettled TINYINT(1),
  _ticket_type VARCHAR(10),
  _malay_odds DECIMAL(20,10),
  _euro_odds DECIMAL(20,10),
  _member_odds DECIMAL(20,10),
  _member_odds_style VARCHAR(10),
  _game_type_id INT(10),
  _request_source VARCHAR(20),
  _tickets LONGTEXT,
  _BetInfo TEXT

)
main:BEGIN

DECLARE _MemberId           INT UNSIGNED      DEFAULT 0   ;
DECLARE _GameVendor         INT               DEFAULT 60  ; -- 第三方平台編號 select * from Game_Vendor ;
DECLARE _MoneyPointRate     INT               DEFAULT 0   ;
DECLARE _MyGameType         INT               DEFAULT 1   ; -- SELECT * FROM Game_Type;  1 = 'T'
DECLARE _MyGameId           INT UNSIGNED      DEFAULT 0   ;
DECLARE _FanShuiType        CHAR(1)           DEFAULT 'T' ;
DECLARE _StatusChang        INT               DEFAULT 0   ;
DECLARE _ZhuDanId           INT DEFAULT 0;   

DECLARE _result_status_old  VARCHAR(32)       DEFAULT '';
DECLARE _settlement_status_old  VARCHAR(32)       DEFAULT '';
DECLARE _modified_datetime_old 	      DATETIME;

DECLARE _wl DECIMAL(20,10) DEFAULT 0;
DECLARE _vbet DECIMAL(20,10) DEFAULT 0;
DECLARE _bet DECIMAL(20,10) DEFAULT 0;

DECLARE gt  VARCHAR(32)       DEFAULT '';

DECLARE _FanShuiFlag         TINYINT DEFAULT 1;

SELECT SysValue INTO _MoneyPointRate FROM System_Value_Setup WHERE SysKey = 'MoneyPointRate'  ; -- 點數與餘額的放大倍率
-- 串關主單沒有game_type_id

IF  ISNULL(_game_type_id) 
THEN
	SET gt = '9999999999';
ELSE
	SET gt = _game_type_id;
END IF;


IF NOT EXISTS (SELECT 1 FROM Game_List WHERE GameVendor = _GameVendor AND TheirGameId = gt  )
THEN 
		
	INSERT INTO Game_List
	SET
		GameVendor      = _GameVendor           
		, TheirGameId   = gt
		, GameName      = _game_type_name
		, GameEName     = _game_type_name
		, GameType      = 1
		, FanShuiType   = 'T' 
		, Note          = ''
	;

	CALL NSP_Report_Group_Update() ;
	

END IF ;

-- 取回我方gameid，記錄帳務使用
SELECT GameId
INTO _MyGameId
FROM Game_List
WHERE 
    GameVendor       = _GameVendor 
    AND TheirGameId  = gt 
 ; 	

-- 取回會員uid，寫明細用的
SELECT UID
INTO _MemberId
FROM Member_Info
WHERE username = _member_code
 ;  	

-- 判斷此筆注單資料是否已存在於db(第三方平台注單表)中， 若「否」才做寫入動作
IF NOT EXISTS(SELECT 1 FROM betdata_tfgaming WHERE id_hash = CRC32(_id) AND id = _id) 
THEN
    INSERT INTO betdata_tfgaming
    SET
	  `id`=_id,
	  `id_hash`=CRC32(_id),
	  `odds`=_odds,
	  `malay_odds`=_malay_odds,
	  `euro_odds`=_euro_odds,
	  `member_odds`=_member_odds,
	  `member_odds_style`=_member_odds_style,
	  `game_type_id`=_game_type_id,
	  `game_type_name` =_game_type_name,
	  `game_market_name` =_game_market_name,
	  `market_option` =_market_option,
	  `map_num`=_map_num,
	  `bet_type_name` =_bet_type_name,
	  `competition_name` =_competition_name,
	  `event_id` =_event_id,
	  `event_name` =_event_name,
	  `event_datetime` =_event_datetime,
	  `date_created` =_date_created,
	  `settlement_datetime`=_settlement_datetime,
	  `modified_datetime` =_modified_datetime,
	  `bet_selection` =_bet_selection,
	  `currency` =_currency,
	  `amount`=_amount,
	  `settlement_status`=_settlement_status,
	  `is_unsettled`=_is_unsettled,
	  `result_status` =_result_status,
	  `result` =_result,
	  `earnings`=_earnings,
	  `handicap`=_handicap,
	  `member_code` =_member_code,
	  `request_source`=_request_source,
	  `is_combo`=_is_combo,
	  `ticket_type`=_ticket_type,
	  `tickets`=_tickets,
	  `betinfo`=_BetInfo;
	  
ELSE

	SELECT result_status,settlement_status,modified_datetime INTO _result_status_old,_settlement_status_old,_modified_datetime_old FROM betdata_tfgaming WHERE id_hash = CRC32(_id) AND `id` = _id;
	
	IF _settlement_status_old <> _settlement_status
	THEN
		SET _StatusChang = 1;
	END IF;	
	
	IF _result_status_old <> _result_status
	THEN
		SET _StatusChang = 1;
	END IF;
	
	IF _modified_datetime_old <> _modified_datetime
	THEN
		SET _StatusChang = 1;
	END IF;
	
	IF _StatusChang = 1
	THEN
		UPDATE betdata_tfgaming
		SET
		  odds=_odds,
		  malay_odds=_malay_odds,
		  euro_odds=_euro_odds,
		  member_odds=_member_odds,
		  member_odds_style=_member_odds_style,
		  game_type_id=_game_type_id,
		  game_type_name =_game_type_name,
		  game_market_name =_game_market_name,
		  market_option =_market_option,
		  map_num=_map_num,
		  bet_type_name =_bet_type_name,
		  competition_name =_competition_name,
		  event_id =_event_id,
		  event_name =_event_name,
		  event_datetime =_event_datetime,
		  date_created =_date_created,
		  settlement_datetime=_settlement_datetime,
		  modified_datetime =_modified_datetime,
		  bet_selection =_bet_selection,
		  currency =_currency,
		  amount=_amount,
		  settlement_status=_settlement_status,
		  is_unsettled=_is_unsettled,
		  result_status =_result_status,
		  result =_result,
		  earnings=_earnings,
		  handicap=_handicap,
		  member_code =_member_code,
		  request_source =_request_source,
		  is_combo=_is_combo,
		  ticket_type=_ticket_type,
		  tickets=_tickets,
		  BetInfo=_BetInfo
		WHERE id_hash = CRC32(_id) AND id = _id;
	/*else
		UPDATE betdata_tfgaming
		SET
		  BetInfo=_BetInfo
		WHERE id_hash = CRC32(_id) AND id = _id;*/
	END IF;
END IF ;

-- 判斷uid是否有效
IF (_MemberId = 0) THEN
    LEAVE main ;
END IF ;

SELECT `orderid` INTO _ZhuDanId FROM betdata_tfgaming WHERE id_hash = CRC32(_id) AND id = _id;

IF  _settlement_status = 'confirmed' -- 未結單不收
THEN
	LEAVE main ;
END IF;

IF (_result_status = 'WIN')
THEN
	SET _wl = _earnings - _amount ;
	
ELSEIF (_result_status = 'LOSS')
THEN
	SET _wl = _earnings;
	
ELSEIF (_result_status = 'DRAW')
THEN
	SET _wl = 0;
	SET _FanShuiFlag = 0;
ELSE
	SET _wl = 0;
END IF;

IF (_result_status = 'CANCELLED')
THEN
	SET _FanShuiFlag = 0;
END IF;

-- 判斷此筆注單資料是否已存在於db(帳務明細)中， 若「否」才做寫入動作   (帳務明細: report_winlose_detail)
IF NOT EXISTS(SELECT 1 FROM report_winlose_detail WHERE GameVendor = _GameVendor AND ZhuDanId = _ZhuDanId)
THEN
	
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
		, GameId 	        = _MyGameId 
		, ZhuDanId              = _ZhuDanId
		, TableId 	        = 0
		, RoundCode             = ''
		, RoundId 	        = 0
		, Bet                   = _amount * _MoneyPointRate
		, YouXiaoTouZhu         = _amount * _MoneyPointRate -- 有效投註( 金額 )
		, WinLose               = _wl 	* _MoneyPointRate
		, JPMoney               = 0               -- 此階段不處理
		, FanShuiRate           = 0		      -- 此階段不處理
		, FanShuiPoints         = 0               -- (此階段不處理) 週反水:寫0
		, ClientIp              = ''
		, CreateDate            = _date_created
		, PaiCaiDate            = _settlement_datetime
		, CheckoutDate          = UDF_Report_Winlose_Detail_CheckoutDate2(_settlement_datetime) -- 隔日帳    
		, FanShuiFlag			= _FanShuiFlag
	;

	IF _amount > 0
	THEN
		UPDATE member_info
		SET ChuKuanXianE = CASE WHEN 
			ChuKuanXianE - (_amount * _MoneyPointRate) > 0 THEN 
			ChuKuanXianE - (_amount * _MoneyPointRate) 
		ELSE 0 END             
		WHERE uid = _MemberId ; 		
	END IF ;
		
ELSE
	IF _StatusChang = 1
	THEN

		CALL NSP_Report_Winlose_Detail_Accounting_Correct3
		(
			  _GameVendor                    	-- _GameVendor  INT    UNSIGNED
			, _ZhuDanId                      	-- _ZhuDanId    INT    UNSIGNED
			, _amount * _MoneyPointRate 		-- _NewYouXiaoTouZhu  BIGINT
			, _wl * _MoneyPointRate      		-- _NewWinLose 
			, _settlement_datetime               	-- _UpdateTime  DATETIME  派彩時間         
		) ;  
		
	END IF;

END IF ;

END$$

DELIMITER ;