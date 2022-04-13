INSERT INTO game_vendor SET
  `RowId` = 71,
  `VendorName` = 'FTG',
  `VendorEName` = 'FTG',
  `WalletMode` = 'S';


INSERT INTO Game_List SET GameVendor = 71, TheirGameId='39',GameEName='Giant King Kong', GameName='巨兽金刚', GameType='2',FanShuiType='E';
INSERT INTO Game_List SET GameVendor = 71, TheirGameId='245',GameEName='Beans of Wonder', GameName='魔豆', GameType='2',FanShuiType='E';
INSERT INTO Game_List SET GameVendor = 71, TheirGameId='251',GameEName='Place of Ra', GameName='日轮宝殿', GameType='2',FanShuiType='E';
INSERT INTO Game_List SET GameVendor = 71, TheirGameId='250',GameEName='Laughing Maitreya', GameName='大笑弥勒', GameType='2',FanShuiType='E';
INSERT INTO Game_List SET GameVendor = 71, TheirGameId='41',GameEName='Fortune Telling', GameName='奇门遁甲', GameType='2',FanShuiType='E';
INSERT INTO Game_List SET GameVendor = 71, TheirGameId='53',GameEName='Ancient Creatures', GameName='远古生物', GameType='2',FanShuiType='E';
INSERT INTO Game_List SET GameVendor = 71, TheirGameId='52',GameEName='Fruit Land', GameName='水果乐园', GameType='2',FanShuiType='E';
INSERT INTO Game_List SET GameVendor = 71, TheirGameId='14',GameEName='Hoo Hey How slot', GameName='鱼虾蟹slot', GameType='2',FanShuiType='E';
INSERT INTO Game_List SET GameVendor = 71, TheirGameId='44',GameEName='Goblin Mine', GameName='哥布林矿坑', GameType='2',FanShuiType='E';
INSERT INTO Game_List SET GameVendor = 71, TheirGameId='42',GameEName='Songkran', GameName='泰湿控', GameType='2',FanShuiType='E';
INSERT INTO Game_List SET GameVendor = 71, TheirGameId='40',GameEName='Scratch', GameName='刮刮乐', GameType='2',FanShuiType='E';
INSERT INTO Game_List SET GameVendor = 71, TheirGameId='36',GameEName='Blackjack', GameName='Blackjack', GameType='2',FanShuiType='E';
INSERT INTO Game_List SET GameVendor = 71, TheirGameId='35',GameEName='School of Witchcraft', GameName='魔法学园', GameType='2',FanShuiType='E';
INSERT INTO Game_List SET GameVendor = 71, TheirGameId='34',GameEName='Court of Justice', GameName='威震公堂', GameType='2',FanShuiType='E';
INSERT INTO Game_List SET GameVendor = 71, TheirGameId='33',GameEName='Little Red Cap', GameName='小红帽:送餐大作战', GameType='2',FanShuiType='E';
INSERT INTO Game_List SET GameVendor = 71, TheirGameId='21',GameEName='Legendary Gladiator', GameName='斗士传奇', GameType='2',FanShuiType='E';
INSERT INTO Game_List SET GameVendor = 71, TheirGameId='16',GameEName='Lucky Patrick', GameName='幸运派翠克', GameType='2',FanShuiType='E';
INSERT INTO Game_List SET GameVendor = 71, TheirGameId='15',GameEName='Top Cuisine', GameName='美味一番', GameType='2',FanShuiType='E';
INSERT INTO Game_List SET GameVendor = 71, TheirGameId='13',GameEName='Invincible Expedition', GameName='叱吒西游', GameType='2',FanShuiType='E';
INSERT INTO Game_List SET GameVendor = 71, TheirGameId='12',GameEName='Assassinating Signal', GameName='刺客密令', GameType='2',FanShuiType='E';
INSERT INTO Game_List SET GameVendor = 71, TheirGameId='11',GameEName='White Python', GameName='白蛇传', GameType='2',FanShuiType='E';
INSERT INTO Game_List SET GameVendor = 71, TheirGameId='10',GameEName='Wild Settlement', GameName='荒野大西部', GameType='2',FanShuiType='E';
INSERT INTO Game_List SET GameVendor = 71, TheirGameId='9',GameEName='Elves Town', GameName='精灵奇园', GameType='2',FanShuiType='E';
INSERT INTO Game_List SET GameVendor = 71, TheirGameId='8',GameEName='Polar Party', GameName='南极世界', GameType='2',FanShuiType='E';
INSERT INTO Game_List SET GameVendor = 71, TheirGameId='7',GameEName='Tricky Monkey', GameName='超级猴子', GameType='2',FanShuiType='E';
INSERT INTO Game_List SET GameVendor = 71, TheirGameId='6',GameEName='King Collection', GameName='国王的秘宝', GameType='2',FanShuiType='E';
INSERT INTO Game_List SET GameVendor = 71, TheirGameId='5',GameEName='Gold Panning', GameName='淘金乐', GameType='2',FanShuiType='E';
INSERT INTO Game_List SET GameVendor = 71, TheirGameId='4',GameEName='Tai Chi Panda', GameName='功夫高手', GameType='2',FanShuiType='E';
INSERT INTO Game_List SET GameVendor = 71, TheirGameId='3',GameEName='Planet Adventure', GameName='星际冒险', GameType='2',FanShuiType='E';
INSERT INTO Game_List SET GameVendor = 71, TheirGameId='2',GameEName='Fortune Lion', GameName='开运金狮', GameType='2',FanShuiType='E';
INSERT INTO Game_List SET GameVendor = 71, TheirGameId='1',GameEName='Crazy Lab', GameName='疯狂实验室', GameType='2',FanShuiType='E';



INSERT INTO `game_list` SET
  `GameVendor` = 71,
  `GameName` = 'FTG返水',
  `GameType` = 2,
  `FanShuiType` = 'E',
  `TheirGameId` = 'ReportGroupID_101',
  `Note` = 'FanShui';
  
  
INSERT INTO `report_group_desc` (`GroupID`, `Depiction`, `sqlstr`)
VALUES
  (101, 'FTG', 'INSERT INTO report_group (`GroupId`, `GameId`) SELECT 101, GameId FROM Game_List WHERE GameVendor = 71 AND GameType = 2;');




INSERT INTO report_group SET gameid = 91863, groupid =101;
INSERT INTO report_group SET gameid = 91809, groupid =101;
INSERT INTO report_group SET gameid = 91803, groupid =101;
INSERT INTO report_group SET gameid = 91797, groupid =101;
INSERT INTO report_group SET gameid = 91791, groupid =101;
INSERT INTO report_group SET gameid = 91725, groupid =101;
INSERT INTO report_group SET gameid = 91785, groupid =101;
INSERT INTO report_group SET gameid = 91779, groupid =101;
INSERT INTO report_group SET gameid = 91857, groupid =101;
INSERT INTO report_group SET gameid = 91773, groupid =101;
INSERT INTO report_group SET gameid = 91689, groupid =101;
INSERT INTO report_group SET gameid = 91701, groupid =101;
INSERT INTO report_group SET gameid = 91695, groupid =101;
INSERT INTO report_group SET gameid = 91851, groupid =101;
INSERT INTO report_group SET gameid = 91767, groupid =101;
INSERT INTO report_group SET gameid = 91761, groupid =101;
INSERT INTO report_group SET gameid = 91755, groupid =101;
INSERT INTO report_group SET gameid = 91749, groupid =101;
INSERT INTO report_group SET gameid = 91683, groupid =101;
INSERT INTO report_group SET gameid = 91845, groupid =101;
INSERT INTO report_group SET gameid = 91743, groupid =101;
INSERT INTO report_group SET gameid = 91707, groupid =101;
INSERT INTO report_group SET gameid = 91737, groupid =101;
INSERT INTO report_group SET gameid = 91731, groupid =101;
INSERT INTO report_group SET gameid = 91839, groupid =101;
INSERT INTO report_group SET gameid = 91719, groupid =101;
INSERT INTO report_group SET gameid = 91713, groupid =101;
INSERT INTO report_group SET gameid = 91833, groupid =101;
INSERT INTO report_group SET gameid = 91827, groupid =101;
INSERT INTO report_group SET gameid = 91821, groupid =101;
INSERT INTO report_group SET gameid = 91815, groupid =101;
INSERT INTO report_group SET gameid = 91869, groupid =101;