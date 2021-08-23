INSERT INTO game_vendor SET
  `RowId` = 60,
  `VendorName` = '雷火电竞',
  `VendorEName` = 'TFGaming',
  `WalletMode` = 'S';

INSERT INTO Game_List SET GameVendor = 60, TheirGameId='9999999999', GameEName='', GameName='串关', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 60, TheirGameId='1', GameEName='CS:GO', GameName='反恐精英', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 60, TheirGameId='2', GameEName='Dota 2', GameName='刀塔 2', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 60, TheirGameId='3', GameEName='League of Legends', GameName='英雄联盟', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 60, TheirGameId='4', GameEName='Starcraft II', GameName='星际争霸 II', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 60, TheirGameId='5', GameEName='Overwatch', GameName='守望先锋', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 60, TheirGameId='6', GameEName='NBA 2K18', GameName='NBA 2K18', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 60, TheirGameId='7', GameEName='Street Fighter V', GameName='街头霸王 V', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 60, TheirGameId='8', GameEName='Hearthstone', GameName='炉石传说', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 60, TheirGameId='9', GameEName='Heroes of the Storm', GameName='风暴英雄', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 60, TheirGameId='10', GameEName='Starcraft 1', GameName='星际争霸 I', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 60, TheirGameId='11', GameEName='Call of Duty', GameName='使命召唤', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 60, TheirGameId='12', GameEName='Rainbow Six', GameName='彩虹6号', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 60, TheirGameId='13', GameEName='Player Unknown Battleground', GameName='绝地求生', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 60, TheirGameId='14', GameEName='King of Glory', GameName='王者荣耀', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 60, TheirGameId='15', GameEName='Warcraft 3', GameName='魔兽争霸 3', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 60, TheirGameId='16', GameEName='Arena of Valor', GameName='传说对决', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 60, TheirGameId='17', GameEName='Basketball', GameName='篮球', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 60, TheirGameId='18', GameEName='Rocket League', GameName='火箭联盟', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 60, TheirGameId='19', GameEName='Fortnite', GameName='堡垒之夜', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 60, TheirGameId='20', GameEName='Game for Peace', GameName='和平精英', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 60, TheirGameId='21', GameEName='Mobile Legend', GameName='无尽对决', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 60, TheirGameId='22', GameEName='FIFA', GameName='FIFA', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 60, TheirGameId='23', GameEName='Quake', GameName='Quake', GameType = '1', FanShuiType = 'T';
INSERT INTO Game_List SET GameVendor = 60, TheirGameId='24', GameEName='Valorant', GameName='无畏契约', GameType = '1', FanShuiType = 'T';

INSERT INTO `game_list` SET
  `GameVendor` = 60,
  `GameName` = '雷火电竞返水',
  `GameType` = 1,
  `FanShuiType` = 'T',
  `TheirGameId` = 'ReportGroupID_90',
  `Note` = 'FanShui';
  
  
INSERT INTO `report_group_desc` (`GroupID`, `Depiction`, `sqlstr`)
VALUES
  (90, '雷火电竞', 'INSERT INTO report_group (`GroupId`, `GameId`) SELECT 90, GameId FROM Game_List WHERE GameVendor = 60 AND GameType = 1;');

