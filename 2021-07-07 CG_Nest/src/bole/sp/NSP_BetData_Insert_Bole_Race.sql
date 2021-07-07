DELIMITER //

CREATE OR REPLACE PROCEDURE NSP_BetData_Insert_Bole_Race(
    _start_time DATETIME
    ,_end_time DATETIME
    ,_report_id VARCHAR(32)
    ,_id INT UNSIGNED
    ,_game_id VARCHAR(64)
    ,_game_code VARCHAR(64)
    ,_gain_gold DECIMAL(20,10)           -- 輸贏
    ,_player_account VARCHAR(32)

    ,_BetInfo TEXT
)
main:BEGIN

DECLARE _MemberId           INT UNSIGNED      DEFAULT 0   ;

DECLARE _GameVendor         INT               DEFAULT 39  ; -- 第三方平台編號 select * from Game_Vendor ;
DECLARE _MoneyPointRate     INT               DEFAULT 0   ;

DECLARE _MyGameType         INT               DEFAULT 3   ; -- SELECT * FROM Game_Type; ( 3:多人)
DECLARE _MyGameId           INT UNSIGNED      DEFAULT 0   ;
DECLARE _FanShuiType        CHAR(1)           DEFAULT 'M' ;

SELECT SysValue FROM System_Value_Setup WHERE SysKey = 'MoneyPointRate' INTO _MoneyPointRate ; -- 點數與餘額的放大倍率

SELECT GameId        
FROM Game_List 
WHERE 
    GameVendor       = _GameVendor 
    AND TheirGameId  = _game_code 
INTO _MyGameId ; 	-- 取回我方gameid，記錄帳務使用

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
        room_id=NULL
        ,scene_id=NULL
        ,gain_gold=_gain_gold
        ,own_gold=NULL
        ,bet_num=NULL
        ,report_id=_report_id
        ,bet_num_valid=NULL
        ,income_gold=NULL
        ,id=_id
        ,sn=NULL
        ,game_id=_game_id
        ,game_code=_game_code
        ,player_account=_player_account
        ,end_time=_end_time
        ,start_time=_start_time
        ,init_gold=NULL
        ,bet_valid_num=NULL
        ,`type`=NULL
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
            , Bet                   = 0
            , YouXiaoTouZhu         = 0
            , WinLose               = _gain_gold * _MoneyPointRate
            , JPMoney               = 0               		 -- 此階段不處理
            , FanShuiRate           = 0		      		     -- 此階段不處理
            , FanShuiPoints         = 0               		 -- (此階段不處理) 週反水:寫0
            , ClientIp              = ''
            , CreateDate            = _start_time
            , PaiCaiDate            = _end_time              -- 無派彩時間( 改填下注時間 或 不填 ) ( 此欄位給客服參考 )
            , CheckoutDate          = UDF_Report_Winlose_Detail_CheckoutDate() -- 隔日帳    
        ;

END IF ;

END //