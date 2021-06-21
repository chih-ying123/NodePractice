CREATE OR REPLACE TABLE BetData_SBO_Sport
(
id INT UNSIGNED NOT NULL AUTO_INCREMENT
, bet_id  INT UNSIGNED
, parent_bet_id  INT UNSIGNED
, player_name VARCHAR(50)
, vendor_code VARCHAR(32)
, game_code VARCHAR(50)
, trans_type VARCHAR(10)
, currency VARCHAR(10)
, wallet_code VARCHAR(50)
, bet_amount DECIMAL(20,10)
, win_amount DECIMAL(20,10)
, turnover DECIMAL(20,10)
, created_at DATETIME
, traceId VARCHAR(128)
, orderTime DATETIME
, winlostDate DATETIME
, modifyDate DATETIME
, odds DECIMAL(20,10)
, subBet JSON
, BetInfo TEXT

, PRIMARY KEY(id)
)