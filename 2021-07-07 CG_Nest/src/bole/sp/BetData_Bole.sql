-- ,XXXX DECIMAL(20,10)
-- ,XXXX INT UNSIGNED
-- ,XXXX VARCHAR(16)
-- ,id INT UNSIGNED

CREATE OR REPLACE TABLE BetData_Bole
(
room_id INT UNSIGNED
,scene_id INT UNSIGNED
,gain_gold DECIMAL(20,10)           -- 輸贏
,own_gold DECIMAL(20,10)
,bet_num DECIMAL(20,10)             -- 投注
,report_id VARCHAR(32)
,bet_num_valid DECIMAL(20,10)       -- 有效投注
,income_gold DECIMAL(20,10)
,id INT UNSIGNED
,sn VARCHAR(64)
,game_id VARCHAR(64)
,game_code VARCHAR(64)
,player_account VARCHAR(32)
,end_time DATETIME
,start_time DATETIME
,init_gold INT UNSIGNED
,bet_valid_num DECIMAL(20,10)
,type VARCHAR(16)

,BetInfo text

, PRIMARY KEY(id)
)