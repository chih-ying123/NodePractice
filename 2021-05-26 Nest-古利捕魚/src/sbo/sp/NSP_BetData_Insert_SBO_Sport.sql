USE `platform_db_wrv` ; -- 暫時使用 ( 正式版本需移除或是修改為 platform_db )

DELIMITER //

CREATE OR REPLACE PROCEDURE NSP_BetData_Insert_SBO_Sport(
	_bet_id  INT UNSIGNED
  , _parent_bet_id  INT UNSIGNED
  , _player_name VARCHAR(50)
  , _vendor_code VARCHAR(32)
  , _game_code VARCHAR(50)
  , _trans_type VARCHAR(10)
  , _currency VARCHAR(10)
  , _wallet_code VARCHAR(50)
  , _bet_amount DECIMAL(20,10)
  , _win_amount DECIMAL(20,10)
  , _turnover DECIMAL(20,10)
  , _created_at DATETIME
  , _traceId VARCHAR(128)
  , _orderTime DATETIME
  , _winlostDate DATETIME
  , _modifyDate DATETIME
  , _odds DECIMAL(20,10)
  , _subBet JSON
  , _BetInfo TEXT
)
main:BEGIN

DECLARE _MemberId           INT UNSIGNED      DEFAULT 0   ;

DECLARE _GameVendor         INT               DEFAULT 43  ; -- 第三方平台編號 select * from Game_Vendor ;
DECLARE _MoneyPointRate     INT               DEFAULT 0   ;

DECLARE _MyGameType         INT               DEFAULT 1   ; -- SELECT * FROM Game_Type;  1 = 'T'
DECLARE _MyGameId           INT UNSIGNED      DEFAULT 0   ;
DECLARE _FanShuiType        CHAR(1)           DEFAULT 'T' ;
DECLARE _Winlose 			DECIMAL(20,10)    DEFAULT 0   ;

SELECT SysValue FROM System_Value_Setup WHERE SysKey = 'MoneyPointRate' INTO _MoneyPointRate ; -- 點數與餘額的放大倍率

IF NOT EXISTS ( SELECT 1 FROM Game_List WHERE GameVendor = _GameVendor AND TheirGameId = _game_code ) -- 判斷此筆注單的遊戲編號是否已存在於我方的 game_list 中
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

REPLACE INTO `report_group`(GroupId, GameId) VALUES(59, _MyGameId); -- 針對 _MyGameId 做報表畫分群組， 59 是由表 report_group_desc 所編排得來的，目前只有電競。

SELECT UID
FROM Member_Info
WHERE username = _player_name
INTO _MemberId ;  	-- 取回會員uid，寫明細用的

-- 判斷uid是否有效
IF (_MemberId = 0) THEN
    LEAVE main ;
END IF ;

-- 判斷此筆注單資料是否已存在於db(第三方平台注單表)中， 若「否」才做寫入動作
IF NOT EXISTS 
(
    SELECT 1 
    FROM betdata_sbo_sport
    WHERE bet_id = _bet_id
) 
THEN
    INSERT INTO betdata_sbo_sport
    SET
		bet_id  = _bet_id 
		, parent_bet_id  = _parent_bet_id 
		, player_name  = _player_name 
		, vendor_code  = _vendor_code 
		, game_code  = _game_code 
		, trans_type  = _trans_type 
		, currency  = _currency 
		, wallet_code  = _wallet_code 
		, bet_amount  = _bet_amount 
		, win_amount  = _win_amount 
		, turnover  = _turnover 
		, created_at  = _created_at 
		, traceId  = _traceId 
		, orderTime  = _orderTime 
		, winlostDate = _winlostDate
		, modifyDate = _modifyDate
		, odds  = _odds 
		, subBet  = _subBet 
		, betInfo  = _betInfo 
	;
END IF;
	
-- 判斷此筆注單資料是否已存在於db(帳務明細)中， 若「否」才做寫入動作   (帳務明細: report_winlose_detail)
IF NOT EXISTS(SELECT 1 FROM report_winlose_detail WHERE GameVendor = _GameVendor AND ZhuDanId = _bet_id)
THEN
	SET _Winlose = _win_amount - _bet_amount;
	
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
		, ZhuDanId              = _bet_id
		, TableId 	            = 0
		, RoundCode             = ''
		, RoundId 	            = 0
		, Bet                   = _bet_amount         * _MoneyPointRate
		, YouXiaoTouZhu         = _turnover        * _MoneyPointRate -- 有效投註( 金額 )
		, WinLose               = _Winlose          * _MoneyPointRate 
		, JPMoney               = 0               -- 此階段不處理
		, FanShuiRate           = 0		      -- 此階段不處理
		, FanShuiPoints         = 0               -- (此階段不處理) 週反水:寫0
		, ClientIp              = ''
		, CreateDate            = _created_at
		, PaiCaiDate            = _winlostDate
		, CheckoutDate          = UDF_Report_Winlose_Detail_CheckoutDate() -- 隔日帳    
	;

	IF _turnover > 0
	THEN
	    UPDATE member_info
	    SET ChuKuanXianE = CASE WHEN 
		    ChuKuanXianE - (_turnover * _MoneyPointRate) > 0 THEN 
		    ChuKuanXianE - (_turnover * _MoneyPointRate) 
		ELSE 0 END             
	    WHERE uid = _MemberId ; 		
	END IF ;
END IF ;

END //