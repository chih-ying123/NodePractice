 USE `platform_db` ;

DELIMITER //

CREATE OR REPLACE PROCEDURE NSP_Report_Donate_GroupByGame(
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
            'NSP_Report_Donate_GroupByGame'	
            , CONCAT(N'CALL NSP_Report_Donate_GroupByGame('
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

    IF _MemberType < 5
    THEN       

        CALL NSP_Member_Get_Upper_MemberId_Nodes(_MemberAccount, _Node1, _Node2, _Node3, _Node4) ;

        SELECT 
            *
            ,  @TotalRows AS TotalRows  
        FROM
        (
            SELECT 
                *
                , @TotalRows := @TotalRows + 1                                      AS RowNum                  
            FROM
            (
                SELECT
					  gig.GameID	
					, (SELECT GameName FROM game_list WHERE GameID = gig.GameID)				AS Game
					, gig.GroupId															AS GroupId
					,(SELECT Depiction FROM report_group_desc WHERE `GroupID` = gig.GroupId)AS `Group`					
                    , COUNT(1) 	AS DonateCount		
                    , SUM(DonateMoney) 	AS DonateMoney		#打賞金額
                    , (SUM(DonateMoney) / 2) AS Commission 	#主播拆成
                    , (SUM(DonateMoney) / 2) AS CompanyCommission #公司拆成
                FROM
                     (
                        SELECT
                              r.RowId                
							, GameVendor
							, GameID	
                            , r.money  AS DonateMoney  
                        FROM  report_donate_detail AS r
                            INNER JOIN Member_Info AS m ON r.MemberId = m.UId
                        WHERE 
                            (r.GameId IN ( SELECT GameId FROM _GameIdTable))
                            AND r.DonateTime BETWEEN _StartDate AND _EndDate 
                            AND (r.UpId_L1 = _Node1 OR _Node1 = 0)  
                            AND (r.UpId_L2 = _Node2 OR _Node2 = 0)
                            AND (r.UpId_L3 = _Node3 OR _Node3 = 0)
                            AND (r.UpId_L4 = _Node4 OR _Node4 = 0)
                            AND m.IsTestAccount = 0 
                        
                    ) AS t3
                    INNER JOIN _GameIdTable AS gig ON gig.GameId = t3.GameID 
                GROUP BY gig.GroupId,GameID
                ORDER BY gig.GroupId                
            ) AS gg  
        )AS QueryResult
        WHERE QueryResult.RowNum BETWEEN _StartRow AND _EndRow;
    ELSE
    
        CALL NSP_Member_Get_Upper_MemberId_Nodes(_UpperAccount, _Node1, _Node2, _Node3, _Node4) ;
        
        SELECT 
            *	
            , @TotalRows AS TotalRows 	
        FROM
        (
            SELECT
                  @TotalRows := @TotalRows + 1              AS RowNum       
				, gig.GameID	
				, (SELECT GameName FROM game_list WHERE GameID = gig.GameID)				AS Game
				, gig.GroupId															AS GroupId
				,(SELECT Depiction FROM report_group_desc WHERE `GroupID` = gig.GroupId)AS `Group`		
				, COUNT(1) 				AS DonateCount		
				, SUM(t3.money) 		AS DonateMoney		#打賞金額
				, (SUM(t3.money) / 2) 	AS Commission 	#主播拆成
				, (SUM(t3.money) / 2) 	AS CompanyCommission #公司拆成
            FROM
                member_info AS t1
                LEFT JOIN report_donate_detail AS t3 ON t1.UId = t3.MemberId  
                INNER JOIN _GameIdTable AS gig ON gig.GameId = t3.GameID 
            WHERE
                t1.UId = _MemberId
                AND t1.IsTestAccount = 0                 
                AND t3.DonateTime BETWEEN _StartDate AND _EndDate    
                AND (t3.GameId IN ( SELECT GameId FROM _GameIdTable))                
                AND (t3.UpId_L1 = _Node1 OR _Node1 = 0)  
                AND (t3.UpId_L2 = _Node2 OR _Node2 = 0)
                AND (t3.UpId_L3 = _Node3 OR _Node3 = 0)
                AND (t3.UpId_L4 = _Node4 OR _Node4 = 0)
            GROUP BY gig.GroupId,GameID    
            ORDER BY RowNum           
        )AS QueryResult
        WHERE QueryResult.RowNum BETWEEN _StartRow AND _EndRow;   
    
    END IF ;

END //