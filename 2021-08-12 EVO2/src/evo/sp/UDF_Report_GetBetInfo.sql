/*
    report_winlose_detail.ZhuDanId 對應  betdata_evo.transactionId    
    可以得到 betdata_evo.result
*/

ELSEIF _GameId IN(SELECT GameId FROM game_list WHERE GameVendor = 72) THEN 
    
    SELECT 
        `result`
    FROM `betdata_evo`
    WHERE `transactionId` = _ZhuDanId
    INTO _BetInfo ;
            
END IF ;    