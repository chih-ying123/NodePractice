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

        
END//

DELIMITER ;