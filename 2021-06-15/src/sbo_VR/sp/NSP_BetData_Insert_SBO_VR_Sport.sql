DELIMITER $$

USE `platform_db_wrin`$$

DROP PROCEDURE IF EXISTS `NSP_BetData_Insert_SBO_VR_Sport`$$

CREATE DEFINER=`winnie`@`192.168.202.12` PROCEDURE `NSP_BetData_Insert_SBO_VR_Sport`(
	_orderTime DATETIME
	, _modifyDate DATETIME
	, _refNo VARCHAR(32)
	, _username VARCHAR(50)
	, _gameId INT(50)
	, _odds DECIMAL(20,10)
	, _oddsStyle VARCHAR(10)
	, _stake DECIMAL(20,10)
	, _actualStake DECIMAL(20,10)
	, _turnover DECIMAL(20,10)
	, _winLost DECIMAL(20,10)
	, _status VARCHAR(10)
	, _productType VARCHAR(50) 
	, _winLostDate DATETIME
	, _settleTime DATETIME 
	, _subBet JSON
	, _BetInfo TEXT
)
main:BEGIN

DECLARE _MemberId           INT UNSIGNED      DEFAULT 0   ;

DECLARE _GameVendor         INT               DEFAULT 63  ; -- 第三方平台編號 select * from Game_Vendor ;
DECLARE _GroupId         	INT           DEFAULT 93  ; -- 第三方平台編號 select * from Game_Vendor ;
DECLARE _MoneyPointRate     INT               DEFAULT 0   ;

DECLARE _MyGameType         INT               DEFAULT 1   ; -- SELECT * FROM Game_Type;  1 = 'T'
DECLARE _MyGameId           INT UNSIGNED      DEFAULT 0   ;
DECLARE _FanShuiType        CHAR(1)           DEFAULT 'T' ;
DECLARE _ZhuDanId           INT DEFAULT 0;   

DECLARE _StatusChang        INT               DEFAULT 0   ;
DECLARE _status_old         VARCHAR(30)       DEFAULT ''   ;
DECLARE _modifyDate_old DATETIME;
DECLARE _wl DECIMAL(20,10) DEFAULT 0;
DECLARE _vbet DECIMAL(20,10) DEFAULT 0;
DECLARE _bet DECIMAL(20,10) DEFAULT 0;

    IF _orderTime < "2020-08-25 11:00:00"
	THEN
		LEAVE main;
	END IF;


SELECT SysValue INTO _MoneyPointRate FROM System_Value_Setup WHERE SysKey = 'MoneyPointRate'  ; -- 點數與餘額的放大倍率

IF NOT EXISTS (SELECT 1 FROM Game_List WHERE GameVendor = _GameVendor AND TheirGameId = _productType)
THEN 
		
	INSERT INTO Game_List
	SET
		GameVendor      = _GameVendor           
		, TheirGameId   = _productType
		, GameName      = _productType
		, GameEName     = _productType
		, GameType      = 1
		, FanShuiType   = 'T' 
		, Note          = ''
	;
	
	CALL NSP_Report_Group_Update() ;
	
END IF ;

SELECT GameId
INTO _MyGameId
FROM Game_List
WHERE 
    GameVendor       = _GameVendor 
    AND TheirGameId  = _productType 
 ; 	-- 取回我方gameid，記錄帳務使用

REPLACE INTO `report_group`(GroupId, GameId) VALUES(_GroupId, _MyGameId); -- 針對 _MyGameId 做報表畫分群組， 59 是由表 report_group_desc 所編排得來的，目前只有電競。

SELECT UID
INTO _MemberId
FROM Member_Info
WHERE username = _username
 ;  	-- 取回會員uid，寫明細用的

-- 判斷uid是否有效
IF (_MemberId = 0) THEN
    LEAVE main ;
END IF ;

-- 判斷此筆注單資料是否已存在於db(第三方平台注單表)中， 若「否」才做寫入動作
IF NOT EXISTS(SELECT 1 FROM betdata_sbo_vr_sport WHERE refNo_hash = CRC32(_refNo) AND refNo = _refNo)
THEN
    INSERT INTO betdata_sbo_vr_sport
    SET		
		refNo_hash = CRC32(_refNo)
		, orderTime = _orderTime 
		, modifyDate = _modifyDate 
		, refNo = _refNo 
		, username = _username 
		, gameId = _gameId
		, odds = _odds 
		, oddsStyle = _oddsStyle 
		, stake = _stake 
		, actualStake = _actualStake 
		, turnover = _turnover 
		, winLost = _winLost 
		, `status` = _status 
		, productType = _productType 
		, winLostDate = _winLostDate 
		, settleTime = _settleTime 
		, subBet  = _subBet 
		, betInfo  = _betInfo 
	;
ELSE

	SELECT `status`,modifyDate INTO _status_old,_modifyDate_old FROM betdata_sbo_vr_sport	WHERE refNo_hash = CRC32(_refNo) AND refNo = _refNo;
	
	IF _status_old <> _status
	THEN
		SET _StatusChang = 1;
	END IF;
	
	IF _modifyDate_old <> _modifyDate
	THEN
		SET _StatusChang = 1;
	END IF;
	

	IF _StatusChang = 1
	THEN
		UPDATE betdata_sbo_vr_sport
		SET
		orderTime = _orderTime 
		, modifyDate = _modifyDate 
		, refNo = _refNo 
		, username = _username 
		, gameId = _gameId
		, odds = _odds 
		, oddsStyle = _oddsStyle 
		, stake = _stake 
		, actualStake = _actualStake 
		, turnover = _turnover 
		, winLost = _winLost 
		, `status` = _status 
		, productType = _productType 
		, winLostDate = _winLostDate 
		, settleTime = _settleTime 
		, subBet  = _subBet 
		, betInfo  = _betInfo 
		
		WHERE refNo_hash = CRC32(_refNo) AND refNo = _refNo;
	END IF;
END IF;

IF _status = 'running' OR _status = 'waiting' OR _status = 'cancelled' -- 未結單不收
THEN
	LEAVE main ;
END IF;

/*if (_status = 'won' or _status = 'lose')
then
	set _bet = _stake;
	#set _vbet = _actualStake; -- 有效投註( 金額 )
	set _vbet = _turnover; #2020-08-29 20:59 與SBO後台對帳問題，mk部門決議以 turnover 做為有效投注 (有效投注實際為 actualStake)
	SET _wl = _winlost - _actualStake;
elseIF (_status = 'draw') -- 和局算入投注中
then
	set _bet = _stake;
	SET _vbet = 0;
	SET _wl = _winlost - _actualStake;
else
	SET _bet = _stake;
	SET _vbet = _turnover;
	SET _wl = _winlost - _actualStake;
end if;*/

#2020-08-29 20:59 與SBO後台對帳問題，mk部門決議以 turnover 做為有效投注 (有效投注實際為 actualStake)
IF (_status = 'refund' OR _status = 'void' OR _status = 'waiting rejected') -- 和局算入投注中
THEN
	SET _bet = 0;
	SET _vbet = 0;

ELSEIF (_status = 'draw') -- 和局算入投注中
THEN
	SET _bet = _stake;
	SET _vbet = 0;

ELSE
	SET _bet = _stake;
	SET _vbet = _turnover;

END IF;

SELECT `id` INTO _ZhuDanId FROM betdata_sbo_vr_sport WHERE refNo_hash = CRC32(_refNo) AND refNo = _refNo;

-- 判斷此筆注單資料是否已存在於db(帳務明細)中， 若「否」才做寫入動作   (帳務明細: report_winlose_detail)
IF NOT EXISTS(SELECT 1 FROM report_winlose_detail WHERE GameVendor = _GameVendor AND ZhuDanId = _ZhuDanId)
THEN
	#IF _status = 'won' OR _status = 'lose' OR _status = 'draw'
	#THEN
	
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
			, TableId 	            = 0
			, RoundCode             = ''
			, RoundId 	            = 0
			, Bet                   = _bet	* _MoneyPointRate
			, YouXiaoTouZhu         = _vbet * _MoneyPointRate -- 有效投註( 金額 )
			, WinLose               = _winLost * _MoneyPointRate
			, JPMoney               = 0               -- 此階段不處理
			, FanShuiRate           = 0		  -- 此階段不處理
			, FanShuiPoints         = 0               -- (此階段不處理) 週反水:寫0
			, ClientIp              = ''
			, CreateDate            = _orderTime
			, PaiCaiDate            = _winLostDate
			, CheckoutDate          = UDF_Report_Winlose_Detail_CheckoutDate2(_winLostDate) -- 隔日帳    
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
		
	#END IF;
ELSE
	IF _StatusChang = 1
	THEN
		/*update report_winlose_detail
		SET
			  Bet                   = _stake         * _MoneyPointRate
			, YouXiaoTouZhu         = _vbet * _MoneyPointRate  -- 有效投註( 金額 )
			, WinLose               = _wl * _MoneyPointRate
		where MemberId = _MemberId and GameVendor = _GameVendor and GameId = _MyGameId and ZhuDanId = _refNo;*/	
		
		
		CALL NSP_Report_Winlose_Detail_Accounting_Correct3
		(
			  _GameVendor                    	-- _GameVendor  INT    UNSIGNED
			, _refNo                      	-- _ZhuDanId    INT    UNSIGNED
			, _vbet * _MoneyPointRate 									-- _NewYouXiaoTouZhu  BIGINT
			, _winLost * _MoneyPointRate      						-- _NewWinLose 
			, _winLostDate                 		-- _UpdateTime  DATETIME            
		) ;  
		
	END IF;
	
	/*IF (_status = 'draw')
	then
		CALL NSP_Report_Winlose_Detail_Accounting_Correct4
		(
			  _GameVendor                    	-- _GameVendor  INT    UNSIGNED
			, _refNo                      	-- _ZhuDanId    INT    UNSIGNED
			, _bet * _MoneyPointRate									-- _NewBet  BIGINT
			, _vbet * _MoneyPointRate 									-- _NewYouXiaoTouZhu  BIGINT
			, _wl * _MoneyPointRate      						-- _NewWinLose 
			, _winLostDate                 		-- _UpdateTime  DATETIME            
		) ;  	
	end if;*/
	
END IF ;


END$$

DELIMITER ;