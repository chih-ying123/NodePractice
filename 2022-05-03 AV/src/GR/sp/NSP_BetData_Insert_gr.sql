DELIMITER $$
CREATE OR REPLACE PROCEDURE NSP_BetData_Insert_GR
(      
     _id                   BIGINT          
    , _sid 	           VARCHAR(32)     
    , _account             VARCHAR(32)    
    , _game_type           INT(10)        
    , _game_round          BIGINT          
    , _bet                 DECIMAL(12, 4)  
    , _game_result         VARCHAR(32)     
    , _valid_bet           DECIMAL(12, 4)  
    , _win                 DECIMAL(12, 4)  
    , _create_time         DATETIME        
    , _order_id            VARCHAR(50)     
    , _device              VARCHAR(50)     
    , _client_ip           VARCHAR(32)     
    , _c_type              VARCHAR(32)     
    , _profit              DECIMAL(12, 4)  
                  
        
)
main:BEGIN

    DECLARE   _GameVendorId    INT      DEFAULT  82 ;
    DECLARE   _GameId          INT      DEFAULT  0  ;
    DECLARE   _MyGameType      INT      DEFAULT  2  ;
    DECLARE   _FanShuiType     CHAR(1)  DEFAULT  'E';
    DECLARE   _MoneyPointRate  INT      DEFAULT  0  ;
    DECLARE   _MemberId        INT      DEFAULT  0  ;
    DECLARE   _ZhuDanId        INT      DEFAULT  0  ;
   
    
-- 點數與餘額的放大倍率，過去的需求， 這個比例是給遊戲端使用的
    SELECT SysValue INTO _MoneyPointRate FROM System_Value_Setup WHERE SysKey = 'MoneyPointRate' ;

-- 存遊戲到Game_List表  不存在就寫入  
    IF NOT EXISTS (SELECT 1 FROM Game_List WHERE GameVendor = _GameVendorId AND TheirGameId = _game_type)
    THEN 
        INSERT INTO Game_List
        SET
            GameVendor      =   _GameVendorId            
            , TheirGameId   =   _game_type         
            , GameName      =   ''
            , GameType      =   _MyGameType
            , FanShuiType   =   _FanShuiType
            , Note          =   ''            
        ;        
        
        CALL `NSP_Report_Group_Update`();

    END IF; 

-- 找出遊戲在Game_List表的 GameId    
    SELECT GameId INTO _GameId
    FROM   Game_List 
    WHERE  GameVendor   =  _GameVendorId  
    AND  TheirGameId  =  _game_type;
    
-- 利用玩家名稱找我們的會員編號
    SELECT UID INTO   _MemberId 
    FROM   Member_Info
    WHERE  username  =  _account;  	-- 取回會員uid，寫明細用的
    
    -- 如果查不到對應的會員id，就退出程式
 --   IF _MemberId = 0 THEN
 --       LEAVE main; 
 --   END IF ;    
    
    
-- 寫入資料庫    
    IF NOT EXISTS (SELECT 1 FROM `betdata_gr` WHERE `sid` = _sid) 
    THEN
    
        INSERT INTO `betdata_gr` 
        SET
              id              =           _id	              
	    , sid             =          _sid             
	    , account         =          _account             
	    , game_type       =          _game_type              
	    , game_round      =          _game_round          
	    , bet             =          _bet          
	    , game_result     =          _game_result          
	    , valid_bet       =          _valid_bet          
	    , win             =          _win         
	    , create_time     =          _create_time           
	    , order_id        =          _order_id               
	    , device          =          _device                  
	    , client_ip       =          _client_ip                
	    , c_type          =          _c_type                 
	    , profit          =          _profit             
	;           
    END IF;
    
    SELECT rowid INTO _ZhuDanId 
    FROM BetData_gr
    WHERE sid = _sid;
    
    -- 所有內容寫進遊戲紀錄表
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
            , GameType              = _MyGameType       -- *    
            , GameId 	            = _GameId           -- *
            , ZhuDanId              = _ZhuDanId    -- *
            , TableId 	            = 0
            , RoundCode             = ''
            , RoundId 	            = 0
            , Bet                   = _bet    * _MoneyPointRate  -- *
            , YouXiaoTouZhu         = _valid_bet    * _MoneyPointRate  -- *
            , WinLose               = _valid_bet           * _MoneyPointRate  -- *
            , JPMoney               = 0               		
            , FanShuiRate           = 0		      		 
            , FanShuiPoints         = 0               	
            , ClientIp              = ''
            , CreateDate            = _create_time    -- *
            , PaiCaiDate            = _create_time    -- *   
            , CheckoutDate          = UDF_Report_Winlose_Detail_CheckoutDate2(_create_time); -- * 
       
         -- 整段複製過來就好
        -- 防止人家洗錢  (放投注額)
        IF _valid_bet > 0 THEN
	    
            UPDATE member_info
            SET ChuKuanXianE = CASE WHEN 
                ChuKuanXianE - (_valid_bet * _MoneyPointRate) > 0 THEN   -- 投注額
                ChuKuanXianE - (_valid_bet * _MoneyPointRate) 
            ELSE 0 END             
            WHERE uid = _MemberId ; 
		
        END IF ;
     END IF;  
        	
    
END$$
DELIMITER ;