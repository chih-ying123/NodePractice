DELIMITER //

CREATE OR REPLACE PROCEDURE NSP_BetData_Insert_Bole(
    _room_id INT UNSIGNED
    ,_scene_id INT UNSIGNED
    ,_gain_gold DECIMAL(20,10)           -- 輸贏
    ,_own_gold DECIMAL(20,10)
    ,_bet_num DECIMAL(20,10)             -- 投注
    ,_report_id VARCHAR(32)
    ,_bet_num_valid DECIMAL(20,10)       -- 有效投注
    ,_income_gold DECIMAL(20,10)
    ,_id INT UNSIGNED
    ,_sn VARCHAR(64)
    ,_game_id VARCHAR(64)
    ,_game_code VARCHAR(64)
    ,_player_account VARCHAR(32)
    ,_end_time DATETIME
    ,_start_time DATETIME
    ,_init_gold INT UNSIGNED
    ,_bet_valid_num DECIMAL(20,10)
    ,_type VARCHAR(16)
    ,_BetInfo text
)
main:BEGIN

-- INSERT INTO Game_Vendor
-- SET RowId = 39
-- , VendorName = N'博樂'
-- , DisableFlag = 0
-- , Description = N'博樂( 棋牌 )'
-- , VendorEName = 'Bole'
-- , WalletMode = 'S' ;

DECLARE _MemberId           INT UNSIGNED      DEFAULT 0   ;

DECLARE _GameVendor         INT               DEFAULT 39  ; -- 第三方平台編號 select * from Game_Vendor ;
DECLARE _MoneyPointRate     INT               DEFAULT 0   ;

DECLARE _MyGameType         INT               DEFAULT 3   ; -- SELECT * FROM Game_Type; ( 3:多人)
DECLARE _MyGameId           INT UNSIGNED      DEFAULT 0   ;
DECLARE _FanShuiType        CHAR(1)           DEFAULT 'M' ;

SELECT SysValue FROM System_Value_Setup WHERE SysKey = 'MoneyPointRate' INTO _MoneyPointRate ; -- 點數與餘額的放大倍率

-- 判斷此筆注單的遊戲編號是否已存在於我方的 game_list 中 ( 需留意 TheirGameId 為 varchar )
-- Bole 不提供 GameID，但回應值仍有 ( 此處修改為 game_code )

-- IF NOT EXISTS ( SELECT 1 FROM Game_List WHERE GameVendor = _GameVendor AND TheirGameId = _game_code )
-- THEN 

--     INSERT INTO Game_List  -- ID 是自動遞增的值
--     SET
--     GameVendor      = _GameVendor            
--     , TheirGameId   = _game_code
--     --, GameName      = _gameName			-- 最後在補
--     , GameType      = _MyGameType
--     , FanShuiType   = _FanShuiType
--     , Note          = ''
--     ;
    
-- END IF ;


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
WHERE username = _player_account
INTO _MemberId ;  	-- 取回會員uid，寫明細用的

-- 判斷uid是否有效
IF (_MemberId = 0) THEN
    LEAVE main ;
END IF ;

-- 判斷此筆注單資料是否已存在於db(第三方平台注單表)中， 若「否」才做寫入動作
IF NOT EXISTS 
(
    SELECT 1 
    FROM BetData_Bole
    WHERE ID = _id
) 
THEN

    INSERT INTO BetData_Bole SET
        room_id=_room_id
        ,scene_id=_scene_id
        ,gain_gold=_gain_gold
        ,own_gold=_own_gold
        ,bet_num=_bet_num
        ,report_id=_report_id
        ,bet_num_valid=_bet_num_valid
        ,income_gold=_income_gold
        ,id=_id
        ,sn=_sn
        ,game_id=_game_id
        ,game_code=_game_code
        ,player_account=_player_account
        ,end_time=_end_time
        ,start_time=_start_time
        ,init_gold=_init_gold
        ,bet_valid_num=_bet_valid_num
        ,type=_type
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
            , Bet                   = _bet_num          * _MoneyPointRate
            , YouXiaoTouZhu         = _bet_num_valid    * _MoneyPointRate
            , WinLose               = _gain_gold        * _MoneyPointRate
            , JPMoney               = 0               		 -- 此階段不處理
            , FanShuiRate           = 0		      		     -- 此階段不處理
            , FanShuiPoints         = 0               		 -- (此階段不處理) 週反水:寫0
            , ClientIp              = ''
            , CreateDate            = _start_time
            , PaiCaiDate            = _end_time              -- 無派彩時間( 改填下注時間 或 不填 ) ( 此欄位給客服參考 )
            , CheckoutDate          = UDF_Report_Winlose_Detail_CheckoutDate() -- 隔日帳    
        ;

	IF _bet_num > 0 THEN
	    
	    UPDATE member_info
	    SET ChuKuanXianE = CASE WHEN  
		    ChuKuanXianE - (_bet_num * _MoneyPointRate) > 0 THEN 
		    ChuKuanXianE - (_bet_num * _MoneyPointRate) 
		ELSE 0 END             
	    WHERE uid = _MemberId ; 
		
	END IF ;

END IF ;

END //