DELIMITER $$

USE `platform_db_wrt`$$

DROP PROCEDURE IF EXISTS `NSP_BetData_Insert_MC`$$

CREATE DEFINER=`dbtest`@`%` PROCEDURE `NSP_BetData_Insert_MC`(      
      _bet_id 	           VARCHAR(32)     
    , _game_code           VARCHAR(32)     
    , _game_name           VARCHAR(32)    
    , _game_type           INT(10)         
    , _game_type_name      VARCHAR(32)     
    , _field               VARCHAR(32)     
    , _account             VARCHAR(32)     
    , _bet_valid           DECIMAL(12, 4)  
    , _bet_amount          DECIMAL(12, 4)  
    , _got_amount          DECIMAL(12, 4) 
    , _win_amount          DECIMAL(12, 4)  
    , _lose_amount         DECIMAL(12, 4)  
    , _bet_content         VARCHAR(1024)     
    , _content             VARCHAR(1024)     
    , _result              VARCHAR(1024)     
    , _payoff              DECIMAL(12, 4)  
    , _payoff_at           DATETIME         
    , _feedback            DECIMAL(12, 4)  
    , _wash                DECIMAL(12, 4)  
    , _pca_contribute      DECIMAL(12, 4)  
    , _pca_win             DECIMAL(12, 4)  
    , _revenue             DECIMAL(12, 4)  
    , _status            TINYINT(1)      
    , _winlose             DECIMAL(12, 4)        
        
)
main:BEGIN

    DECLARE   _GameVendorId    INT      DEFAULT  81 ;
    DECLARE   _GameId          INT      DEFAULT  0  ;
    DECLARE   _MyGameType      INT      DEFAULT  4  ;
    DECLARE   _FanShuiType     CHAR(1)  DEFAULT  'C';
    DECLARE   _MoneyPointRate  INT      DEFAULT  0  ;
    DECLARE   _MemberId        INT      DEFAULT  0  ;
    DECLARE  _ZhuDanId         INT      DEFAULT  0  ;
    
-- 點數與餘額的放大倍率，過去的需求， 這個比例是給遊戲端使用的
    SELECT SysValue INTO _MoneyPointRate FROM System_Value_Setup WHERE SysKey = 'MoneyPointRate' ;
    
-- 存遊戲到 Game_List表
  IF NOT EXISTS (SELECT 1 FROM Game_List WHERE GameVendor = _GameVendorId AND TheirGameId = _game_code)
    THEN 
        INSERT INTO Game_List
        SET
            GameVendor      =   _GameVendorId            
            , TheirGameId   =   _game_code         
            , GameName      =   _game_name
            , GameType      =   _MyGameType
            , FanShuiType   =   _FanShuiType
            , Note          =   ''            
        ;        
        
        CALL `NSP_Report_Group_Update`();

    END IF;
    
-- 找出遊戲在Game_List表的 GameId
    SELECT GameId   INTO   _GameId
    FROM   Game_List 
    WHERE  GameVendor   =  _GameVendorId 
    AND    TheirGameId  =  _game_code; 
    
    -- 利用玩家名稱找我們的會員編號
    SELECT UID   INTO   _MemberId 
    FROM   Member_Info
    WHERE  username  =  _account;
    

    
-- 寫入資料庫    
    IF NOT EXISTS (SELECT 1 FROM `betdata_mc` WHERE `bet_id` = _bet_id) 
    THEN
    
        INSERT INTO `betdata_mc` 
        SET
             bet_id              =          _bet_id 	              
	    , game_code          =          _game_code              
	    , game_name          =          _game_name             
	    , game_type          =          _game_type              
	    , game_type_name     =          _game_type_name          
	    , `field`            =          _field               
	    , account            =          _account
	    , bet_valid          =          _bet_valid           
	    , bet_amount         =          _bet_amount          
	    , got_amount         =          _got_amount          
	    , win_amount         =          _win_amount          
	    , lose_amount        =          _lose_amount         
	    , bet_content        =          _bet_content           
	    , content            =          _content               
	    , result             =          _result                  
	    , payoff             =          _payoff                
	    , payoff_at          =          _payoff_at                 
	    , feedback           =          _feedback             
	    , wash               =          _wash                
	    , pca_contribute     =          _pca_contribute      
	    , pca_win            =          _pca_win              
	    , revenue            =          _revenue              
	    , `status`           =          _status               
	    , winlose            =          _winlose
	;           
    END IF;
    
    SELECT `id` INTO _ZhuDanId 
    FROM   betdata_mc 
    WHERE  bet_id = _bet_id;
    
        -- 所有內容寫進遊戲紀錄表
    IF NOT EXISTS(SELECT 1 FROM report_winlose_detail WHERE GameVendor = _GameVendorId AND ZhuDanId = _bet_id) 
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
            , GameId 	            = _GameId         -- *
            , ZhuDanId              = _ZhuDanId            -- *
            , TableId 	            = 0
            , RoundCode             = ''
            , RoundId 	            = 0
            , Bet                   = _bet_valid    * _MoneyPointRate  -- *
            , YouXiaoTouZhu         = _bet_valid    * _MoneyPointRate  -- *
            , WinLose               = _winlose      * _MoneyPointRate  -- *
            , JPMoney               = 0               		
            , FanShuiRate           = 0		      		 
            , FanShuiPoints         = 0               	
            , ClientIp              = ''
            , CreateDate            = _payoff_at    -- *
            , PaiCaiDate            = _payoff_at    -- *   
            , CheckoutDate          = UDF_Report_Winlose_Detail_CheckoutDate2(_payoff_at); -- * 
       
        -- 整段複製過來就好
        -- 防止人家洗錢  (放投注額)
        IF _bet_valid > 0 THEN
	    
            UPDATE member_info
            SET ChuKuanXianE = CASE WHEN 
                ChuKuanXianE - (_bet_valid * _MoneyPointRate) > 0 THEN   -- 投注額
                ChuKuanXianE - (_bet_valid * _MoneyPointRate) 
            ELSE 0 END             
            WHERE uid = _MemberId ; 
		
        END IF ;
     END IF;  
    
END$$

DELIMITER ;