DELIMITER $$

USE `platform_db`$$

DROP PROCEDURE IF EXISTS `NSP_BetData_Insert_Lottery`$$

CREATE OR REPLACE PROCEDURE `NSP_BetData_Insert_Lottery`(
  _buyid VARCHAR(45),
  _username VARCHAR(45),
  _CODE VARCHAR(20),
  _playkey VARCHAR(20),
  _list_id VARCHAR(30),
  _period VARCHAR(30),
  _number MEDIUMTEXT,
  _nums INT,
  _money DECIMAL(12,2),
  _pri_money DECIMAL(12,2),  
  _z_buy_rate VARCHAR(60),
  _pri_number VARCHAR(300),
  _modes VARCHAR(12),
  _z_number VARCHAR(30),
  _STATUS INT,
  _created_at DATETIME,
  _prize_time DATETIME,
  _prize_date DATETIME,
  _handicaps VARCHAR(1),
  _currency VARCHAR(250),
  _currency_diff FLOAT          
)
main:BEGIN    
    
    DECLARE _MemberId           INT DEFAULT 0;
   
    DECLARE _MoneyPointRate     INT DEFAULT 0;
    DECLARE _ZhuDanId           INT DEFAULT 0;     	    
    DECLARE _MemberFSPoints     BIGINT 	DEFAULT 0;	
    DECLARE _WOrL               BIGINT  DEFAULT 0;    
    
    DECLARE _GameVendorId       INT             DEFAULT  3   ;    
    DECLARE _MyGameType         INT             DEFAULT  4   ;  
    DECLARE _FanShuiType        CHAR(1)         DEFAULT 'C'  ;
    DECLARE _FanShuiRate        DECIMAL(5, 2)   DEFAULT 0    ;  
    DECLARE _MyGameId           INT                          ;  
    DECLARE _IsTestAccount      BIT             DEFAULT 0    ;        
                      
    SELECT SysValue
    INTO _MoneyPointRate
    FROM `system_value_setup` 
    WHERE SysKey = 'MoneyPointRate';
    
	IF _prize_time < "2019-12-30 12:00:00"
	THEN
		LEAVE main;
	END IF;
    
    IF NOT EXISTS (SELECT 1 FROM Game_List WHERE GameVendor = _GameVendorId AND TheirGameId= _playkey)
    THEN 
            
        INSERT INTO Game_List(GameVendor, TheirGameId, GameType, FanShuiType) VALUES(_GameVendorId, _playkey, _MyGameType, _FanShuiType) ;
        
    END IF ;           
        
    SELECT 
        GameId 
        , GameType
        , FanShuiType
    FROM Game_List 
    WHERE 
        GameVendor = _GameVendorId 
        AND TheirGameId = _playkey
    INTO _MyGameId, _MyGameType, _FanShuiType ;
    
    SELECT 
        t1.UId
        , t1.IsTestAccount
        , CASE _FanShuiType 
            WHEN 'T' THEN t2.FanShuiRate_TiYu
            WHEN 'C' THEN t2.FanShuiRate_CaiPiao
            WHEN 'E' THEN t2.FanShuiRate_EGame 
            WHEN 'V' THEN t2.FanShuiRate_VGame
            WHEN 'G' THEN t2.FanShuiRate_GuaGuaLe
            ELSE t2.FanShuiRate_EGame
          END
    FROM member_info AS t1
       INNER JOIN member_commission AS t2 ON t2.UId = t1.UId
    WHERE t1.UserName = _username
    INTO _MemberId, _IsTestAccount, _FanShuiRate ;  
    
    IF EXISTS (SELECT 1 FROM member_commission WHERE UID = _MemberId AND FanShuiFlag = 0) 
	THEN
		SET _FanShuiRate = 0;
	END IF;
    
    
    SELECT _money * _FanShuiRate / 100 INTO _MemberFSPoints ;    
    
    SET _WOrL = (IFNULL(_pri_money, 0) - _money) * _MoneyPointRate;         
        
    IF NOT EXISTS (SELECT 1 FROM betdate_lottery WHERE buyid_Hash = CRC32(_buyid) AND buyid = _buyid) 
    THEN
        INSERT INTO `betdate_lottery` (
            `buyid`,
            `username`,
            `CODE`,
            `playkey`,
            `list_id`,
            `period`,
            `number`,
            `nums`,
            `money`,
            `pri_money`,
            `z_buy_rate`,
            `pri_number`,
            `modes`,
            `z_number`,
            `STATUS`,
            `created_at`,
            `prize_time`,
            `prize_date`,
            `handicaps`,
            `currency`,
            `currency_diff`,
            `buyid_Hash`
        ) 
        VALUES
        (
            _buyid,
            _username,
            _CODE,
            _playkey,
            _list_id,
            _period,
            _number,
            _nums,
            _money,
            _pri_money,
            _z_buy_rate,
            _pri_number,
            _modes,
            _z_number,
            _STATUS,
            _created_at,
            _prize_time,
            _prize_date,
            _handicaps,
            _currency,
            _currency_diff,
            CRC32(_buyid)
        ) ;
    END IF;
    
        
    IF NOT EXISTS (SELECT 1 FROM `member_info` WHERE username = _username)
    THEN
        LEAVE main;
    END IF; 
    
    SELECT id FROM betdate_lottery WHERE buyid_Hash = CRC32(_buyid) AND buyid = _buyid INTO _ZhuDanId;
    
    IF NOT EXISTS (SELECT 1 FROM report_winlose_detail WHERE GameVendor = _GameVendorId AND  ZhuDanId = _ZhuDanId AND GameId = _MyGameId ) THEN
    
	IF _WOrL = 0 THEN
            SET _MemberFSPoints = 0 ;
        END IF ;
    
        INSERT INTO report_winlose_detail
        (
              MemberId    
            , UpId_L1
            , CommissionRate_L1
            , UpId_L2
            , CommissionRate_L2
            , UpId_L3
            , CommissionRate_L3
            , UpId_L4
            , CommissionRate_L4              
            , GameVendor    
            , GameType       
            , GameId 	              
            , ZhuDanId       
            , TableId 	     
            , RoundCode      
            , RoundId 	     
            , Bet      
            , YouXiaoTouZhu      
            , WinLose
            , JPMoney        
            , FanShuiPoints  
            , ClientIp            
            , CreateDate   
            , PaiCaiDate  
            , CheckoutDate
        )        
        VALUES
        (
              _MemberId                          
            , UDF_Get_Upper_Member_ID(_MemberId, 1)
            , UDF_Get_Upper_Member_CommissonRate(_MemberId, 1, 'WC')
            , UDF_Get_Upper_Member_ID(_MemberId, 2)
            , UDF_Get_Upper_Member_CommissonRate(_MemberId, 2, 'WC')
            , UDF_Get_Upper_Member_ID(_MemberId, 3)
            , UDF_Get_Upper_Member_CommissonRate(_MemberId, 3, 'WC')
            , UDF_Get_Upper_Member_ID(_MemberId, 4)
            , UDF_Get_Upper_Member_CommissonRate(_MemberId, 4, 'WC')              
            , _GameVendorId                      
            , _MyGameType                        
            , _MyGameId                          
            , _ZhuDanId                          
            , 0 	                             
            , ''                                 
            , 0                                  
            , _money    * _MoneyPointRate        
            , _money    * _MoneyPointRate        
            , _WOrL			         
            , 0                                  
            , _MemberFSPoints * _MoneyPointRate  
            , ''                                 
            , _created_at 
            , _prize_time                   
            , UDF_Report_Winlose_Detail_CheckoutDate() 
        ) ;
        IF _MemberFSPoints > 0 THEN
            UPDATE `member_info`
            SET `Money` =  `Money` + (_MemberFSPoints / _MoneyPointRate)
            WHERE UId = _MemberId ;
        END IF ;  
        
        IF _money > 0 THEN
            
            UPDATE `member_info`
            SET ChuKuanXianE = CASE WHEN 
					ChuKuanXianE - _money * _MoneyPointRate > 0 THEN 
					ChuKuanXianE - _money * _MoneyPointRate 
				ELSE 0 END             
            WHERE uid = _MemberId ; 
			
        END IF ;          
    END IF ;    
    
    
END$$

DELIMITER ;