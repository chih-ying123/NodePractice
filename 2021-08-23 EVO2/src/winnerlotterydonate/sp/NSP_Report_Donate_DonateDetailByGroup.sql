 USE `platform_db` ;

DELIMITER //

CREATE OR REPLACE PROCEDURE NSP_Report_Donate_DonateDetailByGroup(
		  _MemberAccount        VARCHAR(50)
        , _GameTypeId		 	VARCHAR(128)
        , _PageIndex            INT
        , _PageSize             INT
        , _StartDate            DATETIME
        , _EndDate              DATETIME
        , _UpperAccount         VARCHAR(50)  	
)
main:BEGIN

    DECLARE _StartRow	    INT DEFAULT 0 ;
	DECLARE _EndRow		    INT DEFAULT 0 ;
	DECLARE _MemberId       INT DEFAULT 0 ;
	DECLARE _MemberType     INT DEFAULT 0 ;	
    
    DECLARE _Node1 INT UNSIGNED    DEFAULT 0 ;
    DECLARE _Node2 INT UNSIGNED    DEFAULT 0 ;
    DECLARE _Node3 INT UNSIGNED    DEFAULT 0 ;
    DECLARE _Node4 INT UNSIGNED    DEFAULT 0 ;	

    INSERT INTO SPLog(SPName, Content) VALUES(
            'NSP_Report_Donate_DonateDetailByGroup'	
            , CONCAT(N'CALL NSP_Report_Donate_DonateDetailByGroup('
            , '''', _MemberAccount, ''''
            , ', '	
            , '''',_GameTypeId, ''''	
            , ', '	
            , _PageIndex
            , ', '
            , _PageSize
            , ', '
            , '''',_StartDate, ''''
            , ', '
            , '''',_EndDate, ''''
            , ', '
            , '''',_UpperAccount, ''''
            , ')'            
        )
    ) ;	


	SET @TotalRows = 0;	   
	IF _PageIndex <= 0 THEN SET _PageIndex = 1; END IF;
	IF _PageSize  <= 0 THEN SET _PageSize  = 30; END IF;
	
	SELECT
		  (_PageIndex - 1) * _PageSize + 1
		, _PageIndex * _PageSize
	INTO _StartRow, _EndRow ;	
	
	SELECT 
          uid 
        , MemberType
	FROM member_info 
	WHERE username = _MemberAccount 
	INTO _MemberId, _MemberType; 
	
    CREATE TEMPORARY TABLE IF NOT EXISTS _GameIdTable(
		  GroupId INT
		, GameId  INT      
		, PRIMARY KEY (GameId, GroupId) 
    ) ENGINE = MEMORY ;
	
	TRUNCATE TABLE _GameIdTable ;
	
	SET @SQL = 'insert into _GameIdTable(GroupId,GameId) SELECT GroupId,GameId FROM report_group WHERE GroupId IN(@GameTypeId) ;' ;  
    SET @SQL = REPLACE(@SQL, '@GameTypeId', _GameTypeId) ;    	
	
    PREPARE stmt1 FROM @SQL ;
    EXECUTE stmt1 ;
    DEALLOCATE PREPARE stmt1;	
    
	DELETE g1 FROM _GameIdTable AS g1 INNER JOIN Game_List AS g2 ON g1.GameId = g2.GameId WHERE g2.GameVendor = 20;   
	DELETE g1 FROM _GameIdTable AS g1 INNER JOIN Game_List AS g2 ON g1.GameId = g2.GameId WHERE g2.Note = 'FanShui';    

/*
時間
單號
館廳
帳號
打賞金
主播名
主播紅
公司紅
備註
*/

	CALL NSP_Member_Get_Upper_MemberId_Nodes(_MemberAccount, _Node1, _Node2, _Node3, _Node4) ;
	
	SET @TotalRows = 0;
	
	SELECT 
		*
		,  @TotalRows AS TotalRows  
	FROM
	(
		SELECT
			  @TotalRows := @TotalRows + 1                                      AS RowNum     
			, MemberAccount    #會員帳號
			, NickName     
			, gig.GameID	
			, (SELECT GameName FROM game_list WHERE GameID = gig.GameID)			AS Game
			, gig.GroupId															AS GroupId
			, (SELECT Depiction FROM report_group_desc WHERE `GroupID` = gig.GroupId)AS `Group`				
			, DonateMoney 			#打賞金額
			, (DonateMoney / 2) AS Commission 	#主播拆成
			, (DonateMoney / 2) AS CompanyCommission #公司拆成
			, DonateTime
			, DonateId
			, (SELECT `key` FROM `donate_id` WHERE `id` = DonateId) AS DonateName #部門名稱
			, CASE GameVendor
				WHEN 3 THEN (SELECT `buyid` FROM `donate_winner_lottery` WHERE `id` = ZhuDanId)   #贏家彩票
				WHEN 46 THEN (SELECT `buyid` FROM `donate_winner_live` WHERE `id` = ZhuDanId)  #贏家真人
				ELSE 
					''
				END   AS ZhuDanId #單號
			, CASE GameVendor
				WHEN 3 THEN (SELECT `girlname` FROM `donate_winner_lottery` WHERE `id` = ZhuDanId)   #贏家彩票
				WHEN 46 THEN (SELECT `dealername` FROM `donate_winner_live` WHERE `id` = ZhuDanId)  #贏家真人
				ELSE 
					''
				END   AS AnchorName#主播名稱	
			, CASE GameVendor
				WHEN 3 THEN (SELECT `listname` FROM `donate_winner_lottery` WHERE `id` = ZhuDanId)   #贏家彩票
				WHEN 46 THEN (SELECT `giftname` FROM `donate_winner_live` WHERE `id` = ZhuDanId)  #贏家真人
				ELSE 
					''
				END   AS GiftName#禮物名稱	
		FROM
			 (
				SELECT
					  r.RowId  
					, m.username		AS MemberAccount    #會員帳號
					, m.NickName		AS NickName                                                         
					, GameVendor
					, GameID	
					, r.money  AS DonateMoney  
					, DonateTime
					, ZhuDanId
					, donate_id 		AS DonateId
				FROM  report_donate_detail AS r
					INNER JOIN Member_Info AS m ON r.MemberId = m.UId
				WHERE 
					IF(_MemberType = 5, m.UId = _MemberId, 1)
					AND (r.GameId IN ( SELECT GameId FROM _GameIdTable))
					AND r.DonateTime BETWEEN _StartDate AND _EndDate 
					AND (r.UpId_L1 = _Node1 OR _Node1 = 0)  
					AND (r.UpId_L2 = _Node2 OR _Node2 = 0)
					AND (r.UpId_L3 = _Node3 OR _Node3 = 0)
					AND (r.UpId_L4 = _Node4 OR _Node4 = 0)
					AND m.IsTestAccount = 0 
				
			) AS t3
			INNER JOIN _GameIdTable AS gig ON gig.GameId = t3.GameID 
			ORDER BY DonateTime ASC               
	)AS QueryResult
	WHERE QueryResult.RowNum BETWEEN _StartRow AND _EndRow;

END //