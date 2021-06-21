
DELIMITER //
CREATE OR REPLACE PROCEDURE NSP_BetData_Insert_EVO
(
   _Id VARCHAR(32) 
  , _startedAt DATETIME 
  , _settledAt DATETIME 
  , _status VARCHAR(32) 
  , _gameType VARCHAR(32) 
  , _playerId VARCHAR(32) 
  , _stake DECIMAL(14, 4) 
  , _payout DECIMAL(14, 4)
  , _winlose DECIMAL(14, 4) 
  , _transactionId  BIGINT UNSIGNED
)
BEGIN

    DECLARE _GameVendorId INT DEFAULT 72 ;    
    DECLARE _GameId       INT DEFAULT 0  ;  
    DECLARE _MyGameType     INT DEFAULT 3  ; 
    
    
    IF NOT EXISTS (SELECT 1 FROM Game_List WHERE GameVendor = _GameVendorId AND TheirGameId = _gameType)
    THEN 
    
        INSERT INTO Game_List
        SET
            GameVendor      = _GameVendorId            
            , TheirGameId   = _gameType
            , GameName      = _gameType
            , GameType      = _MyGameType
            , FanShuiType   = 'M' 
            , Note          = ''
            
        ;
        

    END IF; 
    
    -- 寫入遊戲記錄， transactionId 不存在才寫入
    IF NOT EXISTS (SELECT 1 FROM BetData_EVO WHERE transactionId = _transactionId)
    THEN
    
        INSERT INTO `BetData_EVO` 
        SET
          Id  = _Id 
          , startedAt = _startedAt
          , settledAt = _settledAt
          , `status` = _status
          , gameType  = _gameType 
          , playerId = _playerId
          , stake  = _stake 
          , payout = _payout
          , winlose = _winlose
          , transactionId  = _transactionId  ;
        
    END IF; 

    

    
END//

DELIMITER ;


