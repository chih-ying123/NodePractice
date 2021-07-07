USE platform_db;

DELIMITER //

CREATE OR REPLACE PROCEDURE NSP_Donate_Winner_Live(
	 _dept_id	VARCHAR(10)
	,_buyid 		VARCHAR(50)
	,_username 	VARCHAR(45)
	,_nickname 	VARCHAR(45)
	,_gamename 	VARCHAR(10)
	,_playkey 	VARCHAR(20)
	,_tablenum 	VARCHAR(10)
	,_money		DECIMAL(10,2)
	,_TIME 		DATETIME
	,_dealerid	VARCHAR(45)
	,_dealername VARCHAR(45)
	,_list_id 	VARCHAR(45)
	,_giftname 	VARCHAR(45)
)
main:BEGIN

    DECLARE _MemberId           INT DEFAULT 0;
    DECLARE _MoneyPointRate     INT DEFAULT 0;
    DECLARE _ZhuDanId           INT DEFAULT 0;   
    
    DECLARE _GameVendorId       INT DEFAULT  46;    
    DECLARE _MyGameType         INT DEFAULT  5;  
    DECLARE _MyGameId           INT;     
    DECLARE _FanShuiType        CHAR(1)         DEFAULT 'V'  ;
    DECLARE _donate_id	       INT DEFAULT  1; 
    
    IF NOT EXISTS (SELECT 1 FROM Game_List WHERE GameVendor = _GameVendorId AND TheirGameId= _playkey)
    THEN 
        INSERT INTO Game_List(GameVendor, TheirGameId, GameType, FanShuiType) VALUES(_GameVendorId, _playkey, _MyGameType, _FanShuiType) ;
    END IF ;      
    
    SELECT 
        GameId 
        , GameType
    FROM Game_List 
    WHERE 
        GameVendor = _GameVendorId 
        AND TheirGameId = _playkey
    INTO _MyGameId, _MyGameType;        
                      
    SELECT SysValue
    INTO _MoneyPointRate
    FROM `system_value_setup` 
    WHERE SysKey = 'MoneyPointRate';
    
    SELECT `id` INTO _donate_id FROM `donate_id` WHERE `key` = _dept_id;
    
    IF NOT EXISTS (SELECT 1 FROM donate_Winner_live WHERE buy_Hash = CRC32(_buyid) AND buyid = _buyid) 
    THEN
		INSERT INTO `donate_winner_live` 
		SET
		   `buy_Hash` = CRC32(_buyid)
		  ,`dept_id` = _dept_id
		  ,`buyid` = _buyid
		  ,`username` = _username
		  ,`nickname` = _nickname
		  ,`gamename` = _gamename
		  ,`playkey` = _playkey
		  ,`tablenum` = _tablenum
		  ,`money` = _money
		  ,`TIME` = _TIME
		  ,`dealername` = _dealername
		  ,`list_id` = _list_id
		  ,`giftname` = _giftname;
	END IF;
	
	IF NOT EXISTS (SELECT 1 FROM `member_info` WHERE username = _username)
    THEN
        LEAVE main;
    END IF; 
    
    SELECT id INTO _ZhuDanId FROM donate_Winner_live WHERE buy_Hash = CRC32(_buyid) AND buyid = _buyid;
    SELECT uid INTO _MemberId FROM member_info WHERE username = _username;

	IF NOT EXISTS (SELECT 1 FROM report_donate_detail WHERE GameVendor = _GameVendorId AND  ZhuDanId = _ZhuDanId AND GameId = _MyGameId ) THEN
		
		INSERT INTO `report_donate_detail`
		SET
		   `MemberId` = _MemberId
		  ,`UpId_L1` = UDF_Get_Upper_Member_ID(_MemberId, 1)
		  ,`UpId_L2` = UDF_Get_Upper_Member_ID(_MemberId, 2)
		  ,`UpId_L3` = UDF_Get_Upper_Member_ID(_MemberId, 3)
		  ,`UpId_L4` = UDF_Get_Upper_Member_ID(_MemberId, 4)
		  ,`GameVendor` = _GameVendorId
		  ,`GameType` = _MyGameType
		  ,`GameId` = _MyGameId
		  ,`ZhuDanId` = _ZhuDanId
		  ,`donate_id` = _donate_id
		  ,`money` = _money * _MoneyPointRate
		  ,`CreateTime` = CURRENT_TIMESTAMP
		  ,`DonateTime` = _TIME;

	END IF;

END //