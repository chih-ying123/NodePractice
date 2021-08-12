INSERT INTO Game_List SET GameVendor = 65,TheirGameId='1',GameName='KENO',GameEName='KENO',GameType=4;
INSERT INTO Game_List SET GameVendor = 65,TheirGameId='2',GameName='KENO串關',GameEName='KENO Parlay',GameType=4;

INSERT INTO game_vendor SET
  `RowId` = 65,
  `VendorName` = 'GB彩票',
  `VendorEName` = 'GBLottery',
  `WalletMode` = 'T';

  INSERT INTO `report_group_desc` (`GroupID`, `Depiction`, `sqlstr`)
VALUES
  (94, 'GB彩票', 'INSERT INTO report_group (`GroupId`, `GameId`) SELECT 94, GameId FROM Game_List WHERE GameVendor = 65 AND GameType = 4;');