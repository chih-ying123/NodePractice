DELIMITER $$
CREATE OR REPLACE PROCEDURE NSP_BetData_Insert_PP
(      
     _playerID                  BIGINT          
    , _extPlayerID 	        VARCHAR(100)     
    , _gameID                   VARCHAR(20)    
    , _playSessionID            BIGINT        
    , _parentSessionID          BIGINT          
    , _startDate                DATETIME  
    , _endDate                  DATETIME     
    , _status                   CHAR(1)  
    , _type                     CHAR(1)  
    , _bet                      DECIMAL(15, 2)        
    , _win                      DECIMAL(15, 2)     
    , _currency                 CHAR(5)     
    , _jackpot                  DECIMAL(15, 2)     
    , _roundDetails             TEXT     
    , _winlose                  DECIMAL(15, 2)  
    , _GameType                 TINYINT                
    , _FanShuiType              CHAR(1)      
)
main:BEGIN

    DECLARE   _GameVendorId     INT      DEFAULT  84 ;
    DECLARE   _MyGameId         INT      DEFAULT  0  ;
    DECLARE   _MoneyPointRate   INT      DEFAULT  0  ;
    DECLARE   _MemberId         INT      DEFAULT  0  ;
    
   
    
-- 點數與餘額的放大倍率，過去的需求， 這個比例是給遊戲端使用的
    SELECT SysValue INTO _MoneyPointRate FROM System_Value_Setup WHERE SysKey = 'MoneyPointRate' ;
    
    IF _GameType = 'E'
    THEN
		SET _GameVendorId = 86;
	END IF;
    
    -- 存遊戲到Game_List表  不存在就寫入  
    IF NOT EXISTS (SELECT 1 FROM Game_List WHERE GameVendor = _GameVendorId AND TheirGameId = _gameID)
    THEN 
        INSERT INTO Game_List
        SET
            GameVendor      =   _GameVendorId            
            , TheirGameId   =   _gameID         
            , GameName      =   ''
            , GameType      =   _GameType
            , FanShuiType   =   _FanShuiType
            , Note          =   ''            
        ;        
        
        CALL `NSP_Report_Group_Update`();

    END IF;
    
    -- 找出遊戲在Game_List表的 GameId    
    SELECT GameId INTO _MyGameId
    FROM   Game_List 
    WHERE  GameVendor   =  _GameVendorId  
    AND    TheirGameId  =  _gameID;
        
    -- 利用玩家名稱找我們的會員編號
    SELECT UID INTO   _MemberId 
    FROM   Member_Info
    WHERE  username  =  _extPlayerID;
    
        -- 如果查不到對應的會員id，就退出程式
 --   IF _MemberId = 0 THEN
 --       LEAVE main; 
 --   END IF ; 
    
-- 寫入資料庫    
    IF NOT EXISTS (SELECT 1 FROM `betdata_pp` WHERE `playSessionID` = _playSessionID) 
    THEN
    
        INSERT INTO `betdata_pp` 
        SET
              playerID            =          _playerID	              
	    , extPlayerID         =          _extPlayerID             
	    , gameID              =          _gameID             
	    , playSessionID       =          _playSessionID              
	    , parentSessionID     =          _parentSessionID          
	    , startDate           =          _startDate          
	    , endDate             =          _endDate          
	    , `status`            =          _status          
	    , `type`              =          _type        
	    , bet                 =          _bet           
	    , win                 =          _win               
	    , currency            =          _currency                  
	    , jackpot             =          _jackpot                
	    , roundDetails        =          _roundDetails                 
	    , winlose             =          _winlose
	    , GameType            =          _GameType 
	    , FanShuiType         =          _FanShuiType              
	;           
    END IF;
    
-- 所有內容寫進遊戲紀錄表
    IF NOT EXISTS(SELECT 1 FROM report_winlose_detail WHERE GameVendor = _GameVendorId AND ZhuDanId = _playSessionID) 
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
            , GameVendor            = _GameVendorId       -- *
            , GameType              = _GameType           -- *    
            , GameId 	            = _MyGameId           -- *
            , ZhuDanId              = _playSessionID      -- *
            , TableId 	            = 0
            , RoundCode             = ''
            , RoundId 	            = 0
            , Bet                   = _bet        * _MoneyPointRate  -- *
            , YouXiaoTouZhu         = _bet        * _MoneyPointRate  -- *
            , WinLose               = _winlose    * _MoneyPointRate  -- *
            , JPMoney               = 0               		
            , FanShuiRate           = 0		      		 
            , FanShuiPoints         = 0               	
            , ClientIp              = ''
            , CreateDate            = _startDate    -- *
            , PaiCaiDate            = _endDate    -- *   
            , CheckoutDate          = UDF_Report_Winlose_Detail_CheckoutDate2(_endDate); -- * 
       
         -- 整段複製過來就好
        -- 防止人家洗錢  (放投注額)
        IF _bet > 0 THEN
	    
            UPDATE member_info
            SET ChuKuanXianE = CASE WHEN 
                ChuKuanXianE - (_bet * _MoneyPointRate) > 0 THEN   -- 投注額
                ChuKuanXianE - (_bet * _MoneyPointRate) 
            ELSE 0 END             
            WHERE uid = _MemberId ; 
		
        END IF ;
     END IF;  
   
        	
    
END$$
DELIMITER ;