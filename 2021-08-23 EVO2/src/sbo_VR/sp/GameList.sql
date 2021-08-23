/*INSERT INTO `platform_db_wrin`.`game_vendor` (`RowId`,`VendorName`,`VendorEName`,`WalletMode`)
VALUES
  (63'SBO虛擬體育','SBO_VR_Sport','S');

INSERT INTO Game_List SET GameVendor = 63,GameEName='VirtualSports', TheirGameId='VirtualSports', GameName='VirtualSports', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 63,GameEName='VirtualFootballMobile', TheirGameId='VirtualFootballMobile', GameName='VirtualFootballMobile', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 63,GameEName='VirtualFootballDesktop', TheirGameId='VirtualFootballDesktop', GameName='VirtualFootballDesktop', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 63,GameEName='VirtualRacing', TheirGameId='VirtualRacing', GameName='VirtualRacing', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 63,GameEName='VirtualBasketballMobile', TheirGameId='VirtualBasketballMobile', GameName='VirtualBasketballMobile', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 63,GameEName='VirtualWorldCupMobile', TheirGameId='VirtualWorldCupMobile', GameName='VirtualWorldCupMobile', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 63,GameEName='VirtualWorldCupDesktop', TheirGameId='VirtualWorldCupDesktop', GameName='VirtualWorldCupDesktop', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 63,GameEName='MixParlayDesktop', TheirGameId='MixParlayDesktop', GameName='MixParlayDesktop', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 63,GameEName='MixParlayMobile', TheirGameId='MixParlayMobile', GameName='MixParlayMobile', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 63,GameEName='VirtualBasketballDesktop', TheirGameId='VirtualBasketballDesktop', GameName='VirtualBasketballDesktop', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 63,GameEName='VirtualTennisDesktop', TheirGameId='VirtualTennisDesktop', GameName='VirtualTennisDesktop', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 63,GameEName='VirtualTennisMobile', TheirGameId='VirtualTennisMobile', GameName='VirtualTennisMobile', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 63,GameEName='VirtualEuroCupDesktop', TheirGameId='VirtualEuroCupDesktop', GameName='VirtualEuroCupDesktop', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 63,GameEName='VirtualEuroCupMobile', TheirGameId='VirtualEuroCupMobile', GameName='VirtualEuroCupMobile', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 63,GameEName='VirtualAsianCupDesktop', TheirGameId='VirtualAsianCupDesktop', GameName='VirtualAsianCupDesktop', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 63,GameEName='VirtualAsianCupMobile', TheirGameId='VirtualAsianCupMobile', GameName='VirtualAsianCupMobile', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 63,GameEName='VirtualChampionsCupDesktop', TheirGameId='VirtualChampionsCupDesktop', GameName='VirtualChampionsCupDesktop', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 63,GameEName='VirtualChampionsCupMobile', TheirGameId='VirtualChampionsCupMobile', GameName='VirtualChampionsCupMobile', GameType = '1', FanShuiType = 'T';

#INSERT INTO Game_List SET GameVendor = 63,TheirGameId='ReportGroupID_93', GameName='SBO虛擬體育返水', GameType = '1', FanShuiType = 'T',Note = 'FanShui';

INSERT INTO `platform_db_wrin`.`report_group_desc` (`GroupID`, `Depiction`, `sqlstr`)
VALUES
  (93, 'SBO虛擬體育', 'INSERT INTO report_group (`GroupId`, `GameId`) SELECT 93, GameId FROM Game_List WHERE GameVendor = 63 AND GameType = 1;');


INSERT INTO `platform_db_wrin`.`member_fanshui_rate_setup` (
  `GameVendor`,
  `YouXiaoTouZhu`,
  `FanShuiRate`
)
VALUES
  (63,'1000000','0.70'),
  (63,'200000','0.60'),
  (63,'1000','0.50');*/

INSERT INTO Game_List SET GameVendor = 45,GameEName='Virtual Sports', TheirGameId='VirtualSports', GameName='Virtual Sports', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 45,GameEName='Virtual Football Mobile', TheirGameId='VirtualFootballMobile', GameName='Virtual Football Mobile', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 45,GameEName='Virtual Football Desktop', TheirGameId='VirtualFootballDesktop', GameName='Virtual Football Desktop', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 45,GameEName='Virtual Racing', TheirGameId='VirtualRacing', GameName='Virtual Racing', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 45,GameEName='Virtual Basketball Mobile', TheirGameId='VirtualBasketballMobile', GameName='Virtual Basketball Mobile', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 45,GameEName='Virtual World Cup Mobile', TheirGameId='VirtualWorldCupMobile', GameName='Virtual World Cup Mobile', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 45,GameEName='Virtual World Cup Desktop', TheirGameId='VirtualWorldCupDesktop', GameName='Virtual World Cup Desktop', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 45,GameEName='Mix Parlay Desktop', TheirGameId='MixParlayDesktop', GameName='Mix Parlay Desktop', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 45,GameEName='Mix Parlay Mobile', TheirGameId='MixParlayMobile', GameName='Mix Parlay Mobile', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 45,GameEName='Virtual Basketball Desktop', TheirGameId='VirtualBasketballDesktop', GameName='Virtual Basketball Desktop', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 45,GameEName='Virtual Tennis Desktop', TheirGameId='VirtualTennisDesktop', GameName='Virtual Tennis Desktop', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 45,GameEName='Virtual Tennis Mobile', TheirGameId='VirtualTennisMobile', GameName='Virtual Tennis Mobile', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 45,GameEName='Virtual Euro Cup Desktop', TheirGameId='VirtualEuroCupDesktop', GameName='Virtual Euro Cup Desktop', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 45,GameEName='Virtual Euro Cup Mobile', TheirGameId='VirtualEuroCupMobile', GameName='Virtual Euro Cup Mobile', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 45,GameEName='Virtual AsianCup Desktop', TheirGameId='VirtualAsianCupDesktop', GameName='Virtual Asian Cup Desktop', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 45,GameEName='Virtual AsianCup Mobile', TheirGameId='VirtualAsianCupMobile', GameName='Virtual Asian Cup Mobile', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 45,GameEName='Virtual Champions Cup Desktop', TheirGameId='VirtualChampionsCupDesktop', GameName='Virtual Champions Cup Desktop', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 45,GameEName='Virtual Champions Cup Mobile', TheirGameId='VirtualChampionsCupMobile', GameName='Virtual Champions Cup Mobile', GameType = '1', FanShuiType = 'T';