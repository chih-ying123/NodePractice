CREATE OR REPLACE TABLE BetData_RTG
(
agentId VARCHAR(64)
,agentName VARCHAR(32)
,casinoPlayerId VARCHAR(64)
,casinoId VARCHAR(64)
,playerName VARCHAR(32)
,gameDate DATETIME
,gameStartDate DATETIME
,gameNumber INT UNSIGNED
,gameName VARCHAR(64)
,gameId VARCHAR(32)
,gameNameId VARCHAR(64)
,bet DECIMAL(20,10)
,win DECIMAL(20,10)
,payout DECIMAL(20,10)
,jpBet DECIMAL(20,10)
,jpWin DECIMAL(20,10)
,currency VARCHAR(16)
,roundId VARCHAR(32)
,balanceStart DECIMAL(20,10)
,balanceEnd DECIMAL(20,10)
,platform VARCHAR(16)
,externalGameId INT UNSIGNED
,sideBet DECIMAL(20,10)
,featureContribution DECIMAL(20,10)
,featurePayout DECIMAL(20,10)
,featureTypeName VARCHAR(64)
,scatterWon VARCHAR(16) -- TRUE/FALSE
,winLossAmount DECIMAL(20,10)
,gameTechnologyId INT UNSIGNED
,betIpAddress VARCHAR(16)
,id INT UNSIGNED

, PRIMARY KEY(id)
)