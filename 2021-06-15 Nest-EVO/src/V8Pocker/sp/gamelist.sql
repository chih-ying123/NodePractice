INSERT INTO Game_List SET GameVendor = 64,TheirGameId='8310',GameName='番摊',GameEName='Fan Tan',GameType=3;
INSERT INTO Game_List SET GameVendor = 64,TheirGameId='8293',GameName='鱼虾蟹',GameEName='Fish-Shrimp-Crab',GameType=3;
INSERT INTO Game_List SET GameVendor = 64,TheirGameId='8540',GameName='色碟',GameEName='Xoc Dia',GameType=3;
INSERT INTO Game_List SET GameVendor = 64,TheirGameId='8200',GameName='百人骰宝',GameEName='Hundred Sic Bo',GameType=3;
INSERT INTO Game_List SET GameVendor = 64,TheirGameId='890',GameName='看四张抢庄牛牛',GameEName='Four Cards Bull',GameType=3;
INSERT INTO Game_List SET GameVendor = 64,TheirGameId='910',GameName='百家乐',GameEName='Baccarat',GameType=3;
INSERT INTO Game_List SET GameVendor = 64,TheirGameId='860',GameName='三公',GameEName='Three Toy',GameType=3;
INSERT INTO Game_List SET GameVendor = 64,TheirGameId='8600',GameName='卡特',GameEName='Six Cards',GameType=3;
INSERT INTO Game_List SET GameVendor = 64,TheirGameId='600',GameName='21点',GameEName='Black Jack',GameType=3;
INSERT INTO Game_List SET GameVendor = 64,TheirGameId='220',GameName='炸金花',GameEName='Three Cards',GameType=3;
INSERT INTO Game_List SET GameVendor = 64,TheirGameId='630',GameName='十三水',GameEName='Thirteen Cards',GameType=3;
INSERT INTO Game_List SET GameVendor = 64,TheirGameId='830',GameName='抢庄牛牛',GameEName='Bull-Bull',GameType=3;
INSERT INTO Game_List SET GameVendor = 64,TheirGameId='620',GameName='德州扑克',GameEName='Texas Holdem Poker',GameType=3;
INSERT INTO Game_List SET GameVendor = 64,TheirGameId='950',GameName='红黑大战',GameEName='Red-Black War',GameType=3;
INSERT INTO Game_List SET GameVendor = 64,TheirGameId='8100',GameName='看牌点子牛',GameEName='See Card Bull',GameType=3;
INSERT INTO Game_List SET GameVendor = 64,TheirGameId='930',GameName='百人牛牛',GameEName='Hundred People of Bull',GameType=3;
INSERT INTO Game_List SET GameVendor = 64,TheirGameId='610',GameName='斗地主',GameEName='Fight The Landlord',GameType=3;
INSERT INTO Game_List SET GameVendor = 64,TheirGameId='8700',GameName='炸弹13',GameEName='Killer 13',GameType=3;



INSERT INTO game_vendor SET
  `RowId` = 64,
  `VendorName` = 'V8棋牌',
  `VendorEName` = 'V8Pocker',
  `WalletMode` = 'T';

  INSERT INTO `game_list` SET
  `GameVendor` = 64,
  `GameName` = 'V8棋牌返水',
  `GameType` = 3,
  `FanShuiType` = 'M',
  `TheirGameId` = 'ReportGroupID_93',
  `Note` = 'FanShui';

  INSERT INTO `report_group_desc` (`GroupID`, `Depiction`, `sqlstr`)
VALUES
  (93, 'V8棋牌', 'INSERT INTO report_group (`GroupId`, `GameId`) SELECT 93, GameId FROM Game_List WHERE GameVendor = 64 AND GameType = 3;');