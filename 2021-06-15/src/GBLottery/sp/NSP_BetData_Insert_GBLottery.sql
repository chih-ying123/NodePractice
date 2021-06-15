DELIMITER $$

USE `platform_db_wrin`$$

DROP PROCEDURE IF EXISTS `NSP_BetData_Insert_GBLottery`$$

CREATE DEFINER=`root`@`%` PROCEDURE `NSP_BetData_Insert_GBLottery`(
  _SettleID BIGINT(20) 
  ,_BetID BIGINT(20) 
  ,_BetGrpNO VARCHAR(30) 
  ,_TPCode VARCHAR(5) 
  ,_GBSN BIGINT(20) 
  ,_Member_ID VARCHAR(50) 
  ,_CurCode VARCHAR(3) 
  ,_BetDT DATETIME 
  ,_BetType VARCHAR(1) 
  ,_BetTypeParam1 INT(2) 
  ,_BetTypeParam2 INT(2) 
  ,_Wintype VARCHAR(1) 
  ,_HxMGUID INT(1) 
  ,_InitBetAmt DECIMAL(20,10) 
  ,_RealBetAmt DECIMAL(20,10) 
  ,_HoldingAmt DECIMAL(20,10) 
  ,_InitBetRate DECIMAL(20,10) 
  ,_RealBetRate DECIMAL(20,10) 
  ,_PreWinAmt DECIMAL(20,10) 
  ,_BetResult VARCHAR(1) 
  ,_WLAmt DECIMAL(20,10) 
  ,_RefundAmt DECIMAL(20,10) 
  ,_TicketBetAmt DECIMAL(20,10) 
  ,_TicketResult VARCHAR(1) 
  ,_TicketWLAmt DECIMAL(20,10) 
  ,_SettleDT DATETIME 
  ,_subBet LONGTEXT 
  ,_BetInfo TEXT 
)
main:BEGIN

DECLARE _MemberId           INT UNSIGNED      DEFAULT 0   ;

DECLARE _GameVendor         INT               DEFAULT 65  ; -- 第三方平台編號 select * from Game_Vendor ;
DECLARE _GroupId            INT               DEFAULT 94  ; -- 第三方平台編號 select * from Game_Vendor ;
DECLARE _MoneyPointRate     INT               DEFAULT 0   ;

DECLARE _MyGameType         INT               DEFAULT 4   ; -- SELECT * FROM Game_Type; ( 4:彩票 )
DECLARE _MyGameId           INT UNSIGNED      DEFAULT 0   ;
DECLARE _FanShuiType        CHAR(1)           DEFAULT 'T' ; -- T 為 單一錢包 
DECLARE _WinLoseAmt         DECIMAL(20,10)     DEFAULT 0	  ; 

-- 點數與餘額的放大倍率
SELECT SysValue INTO _MoneyPointRate FROM System_Value_Setup WHERE SysKey = 'MoneyPointRate'  ; 

IF NOT EXISTS ( SELECT 1 FROM Game_List WHERE GameVendor = _GameVendor AND TheirGameId = _Wintype ) -- 判斷此筆注單的遊戲編號是否已存在於我方的 game_list 中 ( 需留意 TheirGameId 為 varchar )
THEN 

    INSERT INTO Game_List  -- ID 是自動遞增的值
    SET
    GameVendor      = _GameVendor            
    , TheirGameId   = _Wintype
    , GameName      = ''			-- 最後在補
    , GameType      = _MyGameType
    , FanShuiType   = _FanShuiType
    , Note          = ''
    ;
    
END IF ;

-- 取回我方gameid，記錄帳務使用
SELECT GameId
INTO _MyGameId
FROM Game_List
WHERE 
    GameVendor       = _GameVendor 
    AND TheirGameId  = _Wintype; 	

-- 取回會員uid，寫明細用的
SELECT UID
INTO _MemberId
FROM Member_Info
WHERE username = _Member_ID;	


-- 判斷uid是否有效
IF (_MemberId = 0) THEN
    LEAVE main;
END IF ;


-- 判斷此筆注單資料是否已存在於db(第三方平台注單表)中， 若「否」才做寫入動作
IF NOT EXISTS 
(
    SELECT 1 
    FROM betdata_gblottery
    WHERE SettleID = _SettleID
) 
THEN

    INSERT INTO betdata_gblottery SET
	SettleID = _SettleID
	,BetID = _BetID
	,BetGrpNO = _BetGrpNO
	,TPCode = _TPCode
	,GBSN = _GBSN
	,MemberID = _Member_ID
	,CurCode = _CurCode
	,BetDT = _BetDT
	,BetType = _BetType
	,BetTypeParam1 = _BetTypeParam1
	,BetTypeParam2 = _BetTypeParam2
	,Wintype = _Wintype
	,HxMGUID = _HxMGUID
	,InitBetAmt = _InitBetAmt
	,RealBetAmt = _RealBetAmt
	,HoldingAmt = _HoldingAmt
	,InitBetRate = _InitBetRate
	,RealBetRate = _RealBetRate
	,PreWinAmt = _PreWinAmt
	,BetResult = _BetResult
	,WLAmt = _WLAmt
	,RefundAmt = _RefundAmt
	,TicketBetAmt = _TicketBetAmt
	,TicketResult = _TicketResult
	,TicketWLAmt = _TicketWLAmt
	,SettleDT = _SettleDT
	,subBet = _subBet
	,BetInfo = _BetInfo
	 ;
ELSE
	
	UPDATE betdata_gblottery SET
		 BetID = _BetID
		,BetGrpNO = _BetGrpNO
		,TPCode = _TPCode
		,GBSN = _GBSN
		,MemberID = _Member_ID
		,CurCode = _CurCode
		,BetDT = _BetDT
		,BetType = _BetType
		,BetTypeParam1 = _BetTypeParam1
		,BetTypeParam2 = _BetTypeParam2
		,Wintype = _Wintype
		,HxMGUID = _HxMGUID
		,InitBetAmt = _InitBetAmt
		,RealBetAmt = _RealBetAmt
		,HoldingAmt = _HoldingAmt
		,InitBetRate = _InitBetRate
		,RealBetRate = _RealBetRate
		,PreWinAmt = _PreWinAmt
		,BetResult = _BetResult
		,WLAmt = _WLAmt
		,RefundAmt = _RefundAmt
		,TicketBetAmt = _TicketBetAmt
		,TicketResult = _TicketResult
		,TicketWLAmt = _TicketWLAmt
		,SettleDT = _SettleDT
		,subBet = _subBet
		,BetInfo = _BetInfo
	WHERE SettleID = _SettleID;
		
END IF;

IF _BetResult = 3 -- 調整状态
THEN
	LEAVE main;
END IF;

IF _BetResult = 4 -- 取消
THEN
	SET _WinLoseAmt = 0;   

END IF;
 SET _WinLoseAmt = _WLAmt - _RealBetAmt;	
-- 判斷此筆注單資料是否已存在於db(帳務明細)中， 若「否」才做寫入動作   (帳務明細: report_winlose_detail)
IF NOT EXISTS(SELECT 1 FROM report_winlose_detail WHERE GameVendor = _GameVendor AND ZhuDanId = _SettleID) THEN

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
            , ZhuDanId              = _SettleID
            , TableId 	            = 0
            , RoundCode             = ''
            , RoundId 	            = 0
            , Bet                   =  	_InitBetAmt * _MoneyPointRate
            , YouXiaoTouZhu         =  	_RealBetAmt * _MoneyPointRate -- 有效投註( 金額 ) 
            , WinLose               = 	_WinLoseAmt * _MoneyPointRate
            , JPMoney               = 0               -- 此階段不處理
            , FanShuiRate           = 0		      -- 此階段不處理
            , FanShuiPoints         = 0               -- (此階段不處理) 週反水:寫0
            , ClientIp              = ''
            , CreateDate            = _BetDT
            , PaiCaiDate            = _SettleDT     
            , CheckoutDate          = UDF_Report_Winlose_Detail_CheckoutDate2(_BetDT) -- 隔日帳    
        ;

	IF _InitBetAmt > 0 THEN
	    
	    UPDATE member_info
	    SET ChuKuanXianE = CASE WHEN 
		    ChuKuanXianE - (_InitBetAmt * _MoneyPointRate) > 0 THEN 
		    ChuKuanXianE - (_InitBetAmt * _MoneyPointRate) 
		ELSE 0 END             
	    WHERE uid = _MemberId ; 
		

    END IF ;    
ELSE 
	IF NOT EXISTS (SELECT 1 FROM report_winlose_detail WHERE GameVendor = _GameVendor AND ZhuDanId = _SettleID AND WinLose = ( _WinLoseAmt * _MoneyPointRate)) 
	THEN 
			CALL NSP_Report_Winlose_Detail_Accounting_Correct3
			(
				  _GameVendor                    	-- _GameVendor  INT    UNSIGNED
				, _SettleID                      	-- _ZhuDanId    INT    UNSIGNED
				, _RealBetAmt * _MoneyPointRate 	-- _NewYouXiaoTouZhu  BIGINT
				, _WinLoseAmt * _MoneyPointRate     	-- _NewWinLose 
				, _SettleDT                 		-- _UpdateTime  DATETIME            
			) ;  
	END IF ; 
END IF ;

END$$

DELIMITER ;