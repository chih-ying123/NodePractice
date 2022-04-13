DELIMITER $$
CREATE OR REPLACE PROCEDURE NSP_BetData_Insert_Funky
(      
     _playerId            VARCHAR(32) 
   , _statementDate       DATETIME     
   , _betTime             DATETIME        
   , _refNo               VARCHAR(50)   
   , _betStatus           VARCHAR(32)  
   , _gameCode            VARCHAR(32)  
   , _gameName            VARCHAR(32)  
   , _currency            VARCHAR(32)  
   , _betAmount           DECIMAL(12, 2)     
   , _effectiveStake      DECIMAL(12, 2)  
   , _winLoss             DECIMAL(12, 2) 
        
)
main:BEGIN

    DECLARE _GameVendorId   INT     DEFAULT 79 ;
    DECLARE _GameId         INT     DEFAULT 0  ;
    DECLARE _GameType       INT     DEFAULT 2  ;
    DECLARE _FanShuiType    CHAR(1) DEFAULT 'E';
    DECLARE _MoneyPointRate INT     DEFAULT 0  ;
    DECLARE _MemberId       INT     DEFAULT 0  ;
    DECLARE _ZhuDanId       INT     DEFAULT 0  ;
    
    SELECT SysValue INTO _MoneyPointRate FROM System_Value_Setup WHERE SysKey = 'MoneyPointRate' ;  


    IF NOT EXISTS (SELECT 1 FROM Game_List WHERE GameVendor = _GameVendorId AND TheirGameId = _gameCode)
    THEN 
        INSERT INTO Game_List
        SET
            GameVendor      =   _GameVendorId            
            , TheirGameId   =   _gameCode         
            , GameName      =   _gameName
            , GameType      =   _GameType
            , FanShuiType   =   _FanShuiType
            , Note          =   ''            
        ;        
        
        CALL `NSP_Report_Group_Update`();

    END IF; 
    

    SELECT GameId INTO _GameId
    FROM   Game_List 
    WHERE  GameVendor   =  _GameVendorId 
    AND    TheirGameId  =  _gameCode;   
    

    SELECT UID
    INTO   _MemberId 
    FROM   Member_Info
    WHERE  username  =  _playerId;  	
    
    IF _MemberId = 0 THEN
        LEAVE main; 
    END IF ;
    

    IF NOT EXISTS (SELECT 1 FROM `betdata_funky` WHERE `refNo` = _refNo) 
    THEN
    
        INSERT INTO `betdata_funky` 
        SET
            playerId          =      _playerId
          , statementDate     =      _statementDate
          , betTime           =      _betTime
          , refNo             =      _refNo
          , betStatus         =      _betStatus 
          , gameCode          =      _gameCode
          , gameName          =      _gameName 
          , currency          =      _currency
          , betAmount         =      _betAmount        
          , effectiveStake    =      _effectiveStake 
          , winLoss           =      _winLoss  ;
    END IF;
    
    SELECT id INTO _ZhuDanId 
    FROM BetData_Funky 
    WHERE refNo = _refNo; 
    

    IF NOT EXISTS(SELECT 1 FROM report_winlose_detail WHERE GameVendor = _GameVendorId AND ZhuDanId = _ZhuDanId) 
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
            , GameVendor            = _GameVendorId     -- *
            , GameType              = _GameType       -- *    
            , GameId 	            = _GameId           -- *
            , ZhuDanId              = _ZhuDanId    -- *
            , TableId 	            = 0
            , RoundCode             = ''
            , RoundId 	            = 0
            , Bet                   = _effectiveStake    * _MoneyPointRate  -- *
            , YouXiaoTouZhu         = _effectiveStake    * _MoneyPointRate  -- *
            , WinLose               = _winLoss           * _MoneyPointRate  -- *
            , JPMoney               = 0               		
            , FanShuiRate           = 0		      		 
            , FanShuiPoints         = 0               	
            , ClientIp              = ''
            , CreateDate            = _betTime    -- *
            , PaiCaiDate            = _betTime    -- *   
            , CheckoutDate          = UDF_Report_Winlose_Detail_CheckoutDate2(_statementDate); -- * 
       
        IF _effectiveStake > 0 THEN
	    
            UPDATE member_info
            SET ChuKuanXianE = CASE WHEN 
                ChuKuanXianE - (_effectiveStake * _MoneyPointRate) > 0 THEN   -- 投注額
                ChuKuanXianE - (_effectiveStake * _MoneyPointRate) 
            ELSE 0 END             
            WHERE uid = _MemberId ; 
		
        END IF ;
     END IF;  
        
    
END$$
DELIMITER ;