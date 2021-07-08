DELIMITER //

CREATE OR REPLACE PROCEDURE NSP_BetData_Insert_RTG(
_agentId VARCHAR(64)
,_agentName VARCHAR(32)
,_casinoPlayerId VARCHAR(64)
,_casinoId VARCHAR(64)
,_playerName VARCHAR(32)
,_gameDate DATETIME
,_gameStartDate DATETIME
,_gameNumber INT UNSIGNED
,_gameName VARCHAR(64)
,_gameId VARCHAR(32)
,_gameNameId VARCHAR(64)
,_bet DECIMAL(20,10)
,_win DECIMAL(20,10)
,_payout DECIMAL(20,10)
,_jpBet DECIMAL(20,10)
,_jpWin DECIMAL(20,10)
,_currency VARCHAR(16)
,_roundId VARCHAR(32)
,_balanceStart DECIMAL(20,10)
,_balanceEnd DECIMAL(20,10)
,_platform VARCHAR(16)
,_externalGameId INT UNSIGNED
,_sideBet DECIMAL(20,10)
,_featureContribution DECIMAL(20,10)
,_featurePayout DECIMAL(20,10)
,_featureTypeName VARCHAR(64)
,_scatterWon VARCHAR(16) -- TRUE/FALSE
,_winLossAmount DECIMAL(20,10)
,_gameTechnologyId INT UNSIGNED
,_betIpAddress VARCHAR(16)
,_id INT UNSIGNED
)
main:BEGIN

DECLARE _MemberId           INT UNSIGNED      DEFAULT 0   ;

DECLARE _GameVendor         INT               DEFAULT 37  ; -- 第三方平台編號 select * from Game_Vendor ;
DECLARE _MoneyPointRate     INT               DEFAULT 0   ;

DECLARE _MyGameType         INT               DEFAULT 2   ; -- SELECT * FROM Game_Type; ( 2:電子)
DECLARE _MyGameId           INT UNSIGNED      DEFAULT 0   ;
DECLARE _FanShuiType        CHAR(1)           DEFAULT 'T' ; -- T 為 單一錢包 

SELECT SysValue FROM System_Value_Setup WHERE SysKey = 'MoneyPointRate' INTO _MoneyPointRate ; -- 點數與餘額的放大倍率

IF NOT EXISTS ( SELECT 1 FROM Game_List WHERE GameVendor = _GameVendor AND TheirGameId = _gameId ) -- 判斷此筆注單的遊戲編號是否已存在於我方的 game_list 中 ( 需留意 TheirGameId 為 varchar )
THEN 

    INSERT INTO Game_List  -- ID 是自動遞增的值
    SET
    GameVendor      = _GameVendor            
    , TheirGameId   = _gameId
    , GameName      = _gameName			-- 最後在補
    , GameType      = _MyGameType
    , FanShuiType   = _FanShuiType
    , Note          = ''
    ;
    
END IF ;


SELECT GameId        
FROM Game_List 
WHERE 
    GameVendor       = _GameVendor 
    AND TheirGameId  = _gameId 
INTO _MyGameId ; 	-- 取回我方gameid，記錄帳務使用


-- 針對 _MyGameId 做報表畫分群組， X 是由表 report_group_desc 所編排得來的。 ( 當為多群組時，應做後補動作，例 電子+補魚 )
-- REPLACE INTO `report_group`(GroupId, GameId) VALUES(X, _MyGameId) ; 

SELECT UID
FROM Member_Info
WHERE username = _playerName
INTO _MemberId ;  	-- 取回會員uid，寫明細用的

-- 判斷uid是否有效
IF (_MemberId = 0) THEN
    LEAVE main ;
END IF ;

-- 判斷此筆注單資料是否已存在於db(第三方平台注單表)中， 若「否」才做寫入動作
IF NOT EXISTS 
(
    SELECT 1 
    FROM BetData_RTG
    WHERE ID = _id
) 
THEN

    INSERT INTO BetData_RTG SET
	agentId = _agentId
	,agentName = _agentName
	,casinoPlayerId = _casinoPlayerId
	,casinoId = _casinoId
	,playerName = _playerName
	,gameDate = _gameDate
	,gameStartDate = _gameStartDate
	,gameNumber = _gameNumber
	,gameName = _gameName
	,gameId = _gameId
	,gameNameId = _gameNameId
	,bet = _bet
	,win = _win
	,payout = _payout
	,jpBet = _jpBet
	,jpWin = _jpWin
	,currency = _currency
	,roundId = _roundId
	,balanceStart = _balanceStart
	,balanceEnd = _balanceEnd
	,platform = _platform
	,externalGameId = _externalGameId
	,sideBet = _sideBet
	,featureContribution = _featureContribution
	,featurePayout = _featurePayout
	,featureTypeName = _featureTypeName
	,scatterWon = _scatterWon
	,winLossAmount = _winLossAmount
	,gameTechnologyId = _gameTechnologyId
	,betIpAddress = _betIpAddress
	,id = _id ;

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
            , Bet                   = _bet     * _MoneyPointRate 
            , YouXiaoTouZhu         = _bet     * _MoneyPointRate -- 有效投註( 金額 ) 電子
            , WinLose               = _winLossAmount * _MoneyPointRate 
            , JPMoney               = 0               		 -- 此階段不處理
            , FanShuiRate           = 0		      		 -- 此階段不處理
            , FanShuiPoints         = 0               		 -- (此階段不處理) 週反水:寫0
            , ClientIp              = ''
            , CreateDate            = _gameStartDate
            , PaiCaiDate            = _gameStartDate       -- 無派彩時間( 改填下注時間 或 不填 ) ( 此欄位給客服參考 )
            , CheckoutDate          = UDF_Report_Winlose_Detail_CheckoutDate() -- 隔日帳    
        ;

	IF _bet > 0 THEN
	    
	    UPDATE member_info
	    SET ChuKuanXianE = CASE WHEN 
		    ChuKuanXianE - (_bet * _MoneyPointRate) > 0 THEN 
		    ChuKuanXianE - (_bet * _MoneyPointRate) 
		ELSE 0 END             
	    WHERE uid = _MemberId ; 
		
	END IF ;

END IF ;

END //