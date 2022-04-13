DELIMITER $$
CREATE OR REPLACE PROCEDURE NSP_BetData_Insert_FC
(      
      _bet            DECIMAL(12, 2)  
    , _prize          DECIMAL(12, 2)  
    , _winlose        DECIMAL(12, 2) 
    , _before         DECIMAL(12, 2)  
    , _after          DECIMAL(12, 2)  
    , _jptax          DECIMAL(12, 6)  
    , _jppoints       DECIMAL(12, 2)  
    , _recordID       BIGINT          
    , _account        VARCHAR(32)     
    , _gameID         INT(10)         
    , _gametype       INT(5)          
    ,_jpmode          INT(5)          
    , _bdate          DATETIME        
        
)
main:BEGIN

    DECLARE _GameVendorId     INT      DEFAULT 80 ;
    DECLARE _MyGameId         INT      DEFAULT 0  ;
    DECLARE _MyGameType       INT      DEFAULT 2  ;
    DECLARE _FanShuiType      CHAR(1)  DEFAULT 'E';
    DECLARE _MoneyPointRate   INT      DEFAULT 0  ;
    DECLARE _MemberId         INT      DEFAULT 0  ;
    DECLARE _ZhuDanId         INT      DEFAULT 0  ;
    
    -- 點數與餘額的放大倍率，過去的需求， 這個比例是給遊戲端使用的
    SELECT SysValue INTO _MoneyPointRate FROM System_Value_Setup WHERE SysKey = 'MoneyPointRate' ;  
    

    IF NOT EXISTS (SELECT 1 FROM Game_List WHERE GameVendor = _GameVendorId AND TheirGameId = _gameID)
    THEN 
       IF _gametype = 1 -- 捕魚機
       THEN
		INSERT INTO Game_List
		SET
		    GameVendor      =   _GameVendorId            
		    , TheirGameId   =   _gameID         
		    , GameName      =   ''
		    , GameType      =   _MyGameType
		    , FanShuiType   =   _FanShuiType
		    , Note          =   'Fishing'            
		;
        ELSE
        INSERT INTO Game_List
        SET
            GameVendor      =   _GameVendorId            
            , TheirGameId   =   _gameID         
            , GameName      =   ''
            , GameType      =   _MyGameType
            , FanShuiType   =   _FanShuiType
            , Note          =   ''            
        ;
        END IF;
	
       CALL `NSP_Report_Group_Update`();

    END IF;  
    
    -- 找出遊戲在Game_List表的 GameId
    SELECT GameId INTO _MyGameId
    FROM   Game_List 
    WHERE  GameVendor   =  _GameVendorId 
    AND    TheirGameId  =  _gameID; 


    -- 利用玩家名稱找我們的會員編號
    SELECT UID
    INTO   _MemberId 
    FROM   Member_Info
    WHERE  username  =  _account;  	-- 取回會員uid，寫明細用的
    
    -- 如果查不到對應的會員id，就退出程式
    IF _MemberId = 0 THEN
        LEAVE main; 
    END IF ;
    
    
    IF NOT EXISTS (SELECT 1 FROM `betdata_fc` WHERE `recordID` = _recordID) 
    THEN
    
        INSERT INTO `betdata_fc` 
        SET
            bet          =      _bet
          , prize        =      _prize
          , winlose      =      _winlose
          , `before`     =      _before
          , `after`      =      _after
          , jptax        =      _jptax
          , jppoints     =      _jppoints
          , recordID     =      _recordID
          , account      =      _account
          , gameID       =      _gameID
          , gametype     =      _gametype
          , jpmode       =      _jpmode
          , bdate        =      _bdate  ;
    END IF;
    
    -- 所有內容寫進遊戲紀錄表
    IF NOT EXISTS(SELECT 1 FROM report_winlose_detail WHERE GameVendor = _GameVendorId AND ZhuDanId = _recordID) 
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
            , GameType              = _MyGameType       -- *    
            , GameId 	            = _MYGameId           -- *
            , ZhuDanId              = _recordID    -- *
            , TableId 	            = 0
            , RoundCode             = ''
            , RoundId 	            = 0
            , Bet                   = _bet    * _MoneyPointRate  -- *
            , YouXiaoTouZhu         = _bet    * _MoneyPointRate  -- *
            , WinLose               = _winlose           * _MoneyPointRate  -- *
            , JPMoney               = 0               		
            , FanShuiRate           = 0		      		 
            , FanShuiPoints         = 0               	
            , ClientIp              = ''
            , CreateDate            = _bdate    -- *
            , PaiCaiDate            = _bdate    -- *   
            , CheckoutDate          = UDF_Report_Winlose_Detail_CheckoutDate2(_bdate); -- * 
       
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