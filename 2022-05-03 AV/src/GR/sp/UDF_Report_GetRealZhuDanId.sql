 ELSEIF _GameId IN (SELECT GameId FROM game_list WHERE GameVendor = 82) THEN  
    
        SELECT `sid`
        FROM BETDATA_GR
        WHERE Id = _iZhuDanId
        INTO  _ZhuDanId ;
        
        RETURN _ZhuDanId; 