DELIMITER $$

USE `platform_db_wrin`$$

DROP PROCEDURE IF EXISTS `NSP_BetData_Insert_V8`$$

CREATE DEFINER=`root`@`%` PROCEDURE `NSP_BetData_Insert_V8`(
 _GameID VARCHAR(50) 
  ,_Accounts VARCHAR(50) 
  ,_ServerID INT(10) 
  ,_KindID INT(10) 
  ,_TableID BIGINT(20) 
  ,_ChairID INT(10) 
  ,_UserCount INT(10) 
  ,_CardValue TEXT 
  ,_CellScore DECIMAL(20,10) 
  ,_AllBet DECIMAL(20,10) 
  ,_Profit DECIMAL(20,10) 
  ,_Revenue DECIMAL(20,10)
  ,_GameStartTime DATETIME 
  ,_GameEndTime DATETIME 
  ,_ChannelID INT(10) 
  ,_LineCode VARCHAR(50) 
)
main:BEGIN


DECLARE _MemberId           INT UNSIGNED      DEFAULT 0   ;

DECLARE _GameVendor         INT               DEFAULT 64  ; -- 第三方平台編號 select * from Game_Vendor ;
DECLARE _GroupId         	INT           DEFAULT 93  ; 
DECLARE _MoneyPointRate     INT               DEFAULT 0   ;

DECLARE _MyGameType         INT               DEFAULT 3   ; -- SELECT * FROM Game_Type; ( 3:多人)
DECLARE _MyGameId           INT UNSIGNED      DEFAULT 0   ;
DECLARE _FanShuiType        CHAR(1)           DEFAULT 'T' ;
DECLARE _ZhuDanId           BIGINT UNSIGNED   DEFAULT 0  ;



IF _GameEndTime < '2021-02-01 00:00:00'
THEN
	LEAVE main;
END IF;

SELECT SysValue FROM System_Value_Setup WHERE SysKey = 'MoneyPointRate' INTO _MoneyPointRate ; -- 點數與餘額的放大倍率

-- 判斷此筆注單的遊戲編號是否已存在於我方的 game_list 中


IF NOT EXISTS ( SELECT 1 FROM Game_List WHERE GameVendor = _GameVendor AND TheirGameId = _KindID )
THEN 

    INSERT INTO Game_List  -- ID 是自動遞增的值
    SET
    GameVendor      = _GameVendor            
    , TheirGameId   = _KindID
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
    AND TheirGameId  = _KindID 
INTO _MyGameId ; 	-- 取回我方gameid，記錄帳務使用


-- 針對 _MyGameId 做報表畫分群組， 64 是由表 report_group_desc 所編排得來的。 ( 當為多群組時，應做後補動作，例 電子+補魚 )
-- REPLACE INTO `report_group`(GroupId, GameId) VALUES(64, _MyGameId) ; 

SELECT UID
FROM Member_Info
WHERE username = _Accounts
INTO _MemberId ;  	-- 取回會員uid，寫明細用的

-- 判斷uid是否有效
IF (_MemberId = 0) THEN
    LEAVE main ;
END IF ;

-- 判斷此筆注單資料是否已存在於db(第三方平台注單表)中， 若「否」才做寫入動作
IF NOT EXISTS 
(
    SELECT 1 
    FROM betdata_v8
    WHERE GameID_hash = CRC32(_GameID) AND GameID = _GameID
) 
THEN

    INSERT INTO betdata_v8 
    SET
	
	`GameID_hash`=CRC32(_GameID)
        ,GameID=_GameID
        ,Accounts=_Accounts
        ,ServerID=_ServerID
        ,KindID= _KindID
        ,TableID=_TableID
        ,ChairID=_ChairID
        ,UserCount=_UserCount
        ,CardValue=_CardValue
        ,CellScore=_CellScore
        ,AllBet=_AllBet
        ,Profit=_Profit
        ,Revenue=_Revenue
        ,GameStartTime=_GameStartTime
        ,GameEndTime=_GameEndTime
        ,ChannelID =_ChannelID 
        ,LineCode=_LineCode;
    
ELSE
	UPDATE betdata_v8
	SET 
	 Accounts=_Accounts
        ,ServerID=_ServerID
        ,KindID= _KindID
        ,TableID=_TableID
        ,ChairID=_ChairID
        ,UserCount=_UserCount
        ,CardValue=_CardValue
        ,CellScore=_CellScore
        ,AllBet=_AllBet
        ,Profit=_Profit
        ,Revenue=_Revenue
        ,GameStartTime=_GameStartTime
        ,GameEndTime=_GameEndTime
        ,ChannelID =_ChannelID 
        ,LineCode=_LineCode
	WHERE
	GameID_hash = CRC32(_GameID) AND GameID = _GameID;	 
END IF;



SELECT orderid INTO _ZhuDanId FROM betdata_v8 WHERE GameID_hash = CRC32(_GameID) AND GameID = _GameID;
	
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
            , Bet                   = _CellScore        * _MoneyPointRate 
            , YouXiaoTouZhu         = _CellScore    	* _MoneyPointRate 
            , WinLose               = _Profit        	* _MoneyPointRate 
            , JPMoney               = 0               		 -- 此階段不處理
            , FanShuiRate           = 0		      		     -- 此階段不處理
            , FanShuiPoints         = 0               		 -- (此階段不處理) 週反水:寫0
            , ClientIp              = ''
            , CreateDate            = _GameStartTime
            , PaiCaiDate            = _GameEndTime              -- 無派彩時間( 改填下注時間 或 不填 ) ( 此欄位給客服參考 )
            , CheckoutDate          = UDF_Report_Winlose_Detail_CheckoutDate2(_GameEndTime) -- 隔日帳    
        ;

	IF _CellScore > 0 THEN
	    
	    UPDATE member_info
	    SET ChuKuanXianE = CASE WHEN   
		    ChuKuanXianE - (_CellScore * _MoneyPointRate) > 0 THEN 
		    ChuKuanXianE - (_CellScore * _MoneyPointRate) 
		ELSE 0 END             
	    WHERE uid = _MemberId ; 
		
	END IF ;

END IF ;

END$$

DELIMITER ;