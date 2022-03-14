DELIMITER //
CREATE OR REPLACE PROCEDURE NSP_BetData_Insert_CG
(
     _SerialNumber               BIGINT UNSIGNED 
   , _GameType                VARCHAR(32)     
   , _LogTime                 DATETIME        
   , _BetMoney                DECIMAL(12, 2)  
   , _MoneyWin                DECIMAL(12, 2)  
   , _NormalWin               DECIMAL(12, 2)  
   , _BonusWin                DECIMAL(12, 2)  
   , _JackpotMoney            DECIMAL(12, 2)  
   , _ThirdPartyAccount       VARCHAR(50)     
   , _ValidBet                DECIMAL(12, 2)  
   , _Device                  VARCHAR(50)     
   , _IPAddress               VARCHAR(50)     
   , _WinLose                 DECIMAL(12, 2)   
)
main:BEGIN

    DECLARE _GameVendorId   INT     DEFAULT 76 ;    
    DECLARE _GameId         INT     DEFAULT 0  ;  
    DECLARE _MyGameType     INT     DEFAULT 2  ; 
    DECLARE _FanShuiType    CHAR(1) DEFAULT 'E';
    DECLARE _MoneyPointRate INT     DEFAULT 0  ;    
    DECLARE _MemberId       INT     DEFAULT 0 ;
    
    -- 點數與餘額的放大倍率，過去的需求， 這個比例是給遊戲端使用的
    SELECT SysValue INTO _MoneyPointRate FROM System_Value_Setup WHERE SysKey = 'MoneyPointRate' ;  
    
    IF NOT EXISTS (SELECT 1 FROM Game_List WHERE GameVendor = _GameVendorId AND TheirGameId = _GameType)
    THEN 
    
        -- GameId 是系統自動遞增產生的
        INSERT INTO Game_List
        SET
            GameVendor      = _GameVendorId            
            , GameName      = _GameType
            , GameType      = _MyGameType
            , FanShuiType   = _FanShuiType
            , TheirGameId   = _GameType         -- api那邊拿到的遊戲名稱
            , Note          = ''            
        ;        

    END IF;
    
    
     -- 從api那邊拿到的玩家名稱，查出在我們資料厙裡面的 會員編號(Member_Info.UID)
    SELECT UID
    INTO _MemberId 
    FROM Member_Info
    WHERE username = _ThirdPartyAccount;  	-- 取回會員uid，寫明細用的
    
    
    -- 如果查不到對應的會員id，就退出程式
    IF _MemberId = 0 THEN
     
        LEAVE main; 
    
    END IF ;

	 -- 寫入遊戲記錄， SerialNumber 不存在才寫入
    IF NOT EXISTS (SELECT 1 FROM BetData_CG WHERE SerialNumber = _SerialNumber)
    THEN
    
        INSERT INTO `BetData_CG` 
        SET
            SerialNumber        =   _SerialNumber 
          , GameType            =   _GameType        
          , LogTime             =   _LogTime  
          , BetMoney            =   _BetMoney            
          , MoneyWin            =   _MoneyWin              
          , NormalWin           =   _NormalWin           
          , BonusWin            =   _BonusWin                
          , JackpotMoney        =   _JackpotMoney          
          , ThirdPartyAccount   =   _ThirdPartyAccount       
          , ValidBet            =   _ValidBet              
          , Device              =   _Device                 
          , IPAddress           =   _IPAddress              
          , WinLose             =   _WinLose  ;
    END IF; 
    
    -- 從api那邊拿到的遊戲名稱，查出在我們資料厙裡面的 Game_List.GameId
    SELECT GameId INTO _GameId
    FROM Game_List 
    WHERE  GameVendor = _GameVendorId 
    AND TheirGameId   = _GameId  ;
    
    -- 判斷此筆注單資料是否已存在於db(帳務明細)中， 若「否」才做寫入動作   (帳務明細: report_winlose_detail)
    IF NOT EXISTS(SELECT 1 FROM report_winlose_detail WHERE GameVendor = _GameVendorId AND ZhuDanId = _SerialNumber) THEN
    
    
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
            , GameId 	              = _GameId           -- *
            , ZhuDanId              = _SerialNumber    -- *
            , TableId 	            = 0
            , RoundCode             = ''
            , RoundId 	            = 0
            , Bet                   = _BetMoney     * _MoneyPointRate  -- *
            , YouXiaoTouZhu         = _ValidBet     * _MoneyPointRate  -- *
            , WinLose               = _WinLose   * _MoneyPointRate  -- *
            , JPMoney               = 0               		
            , FanShuiRate           = 0		      		 
            , FanShuiPoints         = 0               	
            , ClientIp              = ''
            , CreateDate            = _LogTime    -- *
            , PaiCaiDate            = _LogTime    -- *   
            , CheckoutDate          = UDF_Report_Winlose_Detail_CheckoutDate2(_LogTime) -- * 
       
        ;
        -- 整段複製過來就好
        -- 防止人家洗錢  (放投注額)
        IF _ValidBet > 0 THEN
	    
            UPDATE member_info
            SET ChuKuanXianE = CASE WHEN 
                ChuKuanXianE - (_ValidBet * _MoneyPointRate) > 0 THEN   -- 投注額
                ChuKuanXianE - (_ValidBet * _MoneyPointRate) 
            ELSE 0 END             
            WHERE uid = _MemberId ; 
		
        END IF ;
     END IF ;  
        
END//

DELIMITER ;