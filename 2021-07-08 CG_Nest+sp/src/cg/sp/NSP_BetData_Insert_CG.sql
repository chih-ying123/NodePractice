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
BEGIN

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

        
END//

DELIMITER ;