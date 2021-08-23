DELIMITER $$

USE `platform_db_wrin`$$

DROP PROCEDURE IF EXISTS `NSP_BetData_Insert_EVO`$$

CREATE DEFINER=`dbtest`@`%` PROCEDURE `NSP_BetData_Insert_EVO`(
   _Id VARCHAR(32) 
  , _startedAt DATETIME 
  , _settledAt DATETIME 
  , _status VARCHAR(32) 
  , _gameType VARCHAR(32) 
  , _playerId VARCHAR(32)
    , _bet VARCHAR(32)          -- 下注描述
  , _stake DECIMAL(14, 4) 
  , _payout DECIMAL(14, 4)
  , _winlose DECIMAL(14, 4)
    , _betid VARCHAR(64) 
    , _code VARCHAR(32)   
  , _transactionId  BIGINT UNSIGNED
  , _result VARCHAR(1024) 
)
main:BEGIN

    -- 變數宣告統一寫在最上面
    DECLARE _GameVendorId   INT     DEFAULT 72 ;    
    DECLARE _GameId         INT     DEFAULT 0  ;  
    DECLARE _MyGameType     INT     DEFAULT 5  ; 
    DECLARE _FanShuiType    CHAR(1) DEFAULT 'V';
    DECLARE _MoneyPointRate INT     DEFAULT 0  ;    
    DECLARE _MemberId      INT      DEFAULT 0 ;
    DECLARE _ZhuDanId           INT DEFAULT 0;
    DECLARE _FanShuiFlag        TINYINT DEFAULT 1;    
    DECLARE _outcome VARCHAR(32);  	
    DECLARE _vBet               BIGINT  DEFAULT 0;
    
    -- 點數與餘額的放大倍率，過去的需求， 這個比例是給遊戲端使用的
    SELECT SysValue INTO _MoneyPointRate FROM System_Value_Setup WHERE SysKey = 'MoneyPointRate' ;  
    
    IF NOT EXISTS (SELECT 1 FROM Game_List WHERE GameVendor = _GameVendorId AND TheirGameId = _gameType)
    THEN 
    
        -- GameId 是系統自動遞增產生的
        INSERT INTO Game_List
        SET
            GameVendor      = _GameVendorId            
            , TheirGameId   = _gameType         -- api那邊拿到的遊戲名稱
            , GameEName     = _gameType
            , GameName      = _gameType
            , GameType      = _MyGameType
            , FanShuiType   = _FanShuiType
            , Note          = ''            
        ;        
        
        CALL `NSP_Report_Group_Update`();

    END IF; 
    
     -- 從api那邊拿到的玩家名稱，查出在我們資料厙裡面的 會員編號(Member_Info.UID)
    SELECT UID
    INTO _MemberId 
    FROM Member_Info
    WHERE username = _playerId;  	-- 取回會員uid，寫明細用的
    
    
  
    
   
    
    -- 從api那邊拿到的遊戲名稱，查出在我們資料厙裡面的 Game_List.GameId
    SELECT GameId INTO _GameId
    FROM Game_List 
    WHERE  GameVendor = _GameVendorId 
    AND TheirGameId   = _gameType  ;
    
    
    
    -- 寫入遊戲記錄， transactionId 不存在才寫入
    IF NOT EXISTS (SELECT 1 FROM BetData_EVO WHERE betid_hash = CRC32(_betid) AND betid = _betid) 
    THEN
    
        INSERT INTO `BetData_EVO` 
        SET
            Id  = _Id 
          , startedAt = _startedAt
          , settledAt = _settledAt
          , `status`  = _status
          , gameType  = _gameType 
          , playerId  = _playerId
                  , bet       = _bet            -- 下注描述
          , stake     = _stake 
          , payout    =  _payout
          , winlose   = _winlose
		  , betid	  = _betid
		  , `code`	  = _code          
          , transactionId  = _transactionId 
          , result  = _result  ;
    END IF; 
    
    SELECT RowId INTO _ZhuDanId FROM BetData_EVO WHERE betid_hash = CRC32(_betid) AND betid = _betid;
    
    SET _vBet = _stake;
    
    -- 如果這一筆遊戲記錄景狀態值不是 Resolved 的話，就退出sp，不把資料寫入
    -- 只寫入已經結算輸贏的記錄
    IF _status <> 'Resolved'
    THEN
     
        #LEAVE main; 
        SET _vBet = 0;
        SET _FanShuiFlag = 0;
    
    END IF ;      
    
    SELECT JSON_VALUE(result, '$.outcome') INTO _outcome FROM `betdata_evo` WHERE betid_hash = CRC32(_betid) AND betid = _betid;
    
    IF _gameType = 'dragontiger' 
    THEN
    
		IF _outcome = 'Tie'
		THEN
			SET _vBet = _payout;
		END IF;
		
		IF _outcome = 'SuitedTie'
		THEN
			SET _vBet = _payout;
		END IF;	
			
	END IF;
	
	IF _gameType = 'topcard'
	THEN
		IF _outcome = 'X'
		THEN
			SET _vBet = _payout;
		END IF;
	END IF;
    
    IF _gameType = 'baccarat'
    THEN
    
		IF _winlose > 0
		THEN
			IF _stake > _winlose
			THEN
				SET _vBet = _winlose;
			END IF;
		END IF;   

    END IF;
    
	IF _winlose = 0
	THEN
		SET _vBet = 0;
		SET _FanShuiFlag = 0;
	END IF;		
      
    -- 如果查不到對應的會員id，就退出程式
    IF _MemberId = 0 THEN     
        LEAVE main;     
    END IF ;
    
    -- 判斷此筆注單資料是否已存在於db(帳務明細)中， 若「否」才做寫入動作   (帳務明細: report_winlose_detail)
    IF NOT EXISTS(SELECT 1 FROM report_winlose_detail WHERE GameVendor = _GameVendorId AND ZhuDanId = _ZhuDanId) THEN
    
    
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
            , GameVendor            = _GameVendorId     -- *
            , GameType              = _MyGameType       -- *    
            , GameId 	            = _GameId           -- *
            , ZhuDanId              = _ZhuDanId    -- *
            , TableId 	            = 0
            , RoundCode             = ''
            , RoundId 	            = 0
            , Bet                   = _stake     * _MoneyPointRate  -- *
            , YouXiaoTouZhu         = _vBet      * _MoneyPointRate  -- *
            , WinLose               = _winlose   * _MoneyPointRate  -- *
            , JPMoney               = 0               		
            , FanShuiRate           = 0		      		 
            , FanShuiPoints         = 0               	
            , ClientIp              = ''
            , CreateDate            = _startedAt    -- *
            , PaiCaiDate            = _settledAt    -- *   
            , CheckoutDate          = UDF_Report_Winlose_Detail_CheckoutDate2(_settledAt) -- * 
            , FanShuiFlag		= _FanShuiFlag
       
        ;    
        
        
        -- 整段複製過來就好
        -- 防止人家洗錢  (放投注額)
        IF _stake > 0 THEN
	    
            UPDATE member_info
            SET ChuKuanXianE = CASE WHEN 
                ChuKuanXianE - (_stake * _MoneyPointRate) > 0 THEN   -- 投注額
                ChuKuanXianE - (_stake * _MoneyPointRate) 
            ELSE 0 END             
            WHERE uid = _MemberId ; 
		
        END IF ;
    
    
    END IF;
    

    
END$$

DELIMITER ;