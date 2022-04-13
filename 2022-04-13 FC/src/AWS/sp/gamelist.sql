INSERT INTO `platform_db`.`game_vendor` (`RowId`,`VendorName`,`VendorEName`,`WalletMode`)
VALUES
  (62,'AWS','AWS','S');

INSERT INTO Game_List SET GameEName='DJ MONKEY KING', GameName='DJ大圣', TheirGameId='AWS_1', GameVendor=62,GameType=2;
INSERT INTO Game_List SET GameEName='MOUSE OF FORTUNE', GameName='鼠财神', TheirGameId='AWS_2', GameVendor=62,GameType=2;
INSERT INTO Game_List SET GameEName="ROCK N' OWL", GameName='摇滚猫头鹰', TheirGameId='AWS_3', GameVendor=62,GameType=2;
INSERT INTO Game_List SET GameEName='BOOK OF TRICKS', GameName='恶作剧之神', TheirGameId='AWS_4', GameVendor=62,GameType=2;
INSERT INTO Game_List SET GameEName='ALICE IN WINTERLAND', GameName='白雪爱丽丝', TheirGameId='AWS_5', GameVendor=62,GameType=2;
INSERT INTO Game_List SET GameEName='DALANG', GameName='达郎', TheirGameId='AWS_6', GameVendor=62,GameType=2;
INSERT INTO Game_List SET GameEName='SHISA', GameName='风狮爷', TheirGameId='AWS_7', GameVendor=62,GameType=2;
INSERT INTO Game_List SET GameEName='FENG SHEN', GameName='封神', TheirGameId='AWS_8', GameVendor=62,GameType=2;
INSERT INTO Game_List SET GameEName='888 TOWER	888', GameName='黄金塔', TheirGameId='AWS_9', GameVendor=62,GameType=2;
INSERT INTO Game_List SET GameEName='RONIN', GameName='浪人', TheirGameId='AWS_10', GameVendor=62,GameType=2;
INSERT INTO Game_List SET GameEName='WIENER DONUTS', GameName='甜甜犬', TheirGameId='AWS_11', GameVendor=62,GameType=2;
INSERT INTO Game_List SET GameEName='CANDY PLANET', GameName='糖果星球', TheirGameId='AWS_12', GameVendor=62,GameType=2;
INSERT INTO Game_List SET GameEName='YEEEEE YA!', GameName='咿～呀！', TheirGameId='AWS_13', GameVendor=62,GameType=2;
INSERT INTO Game_List SET GameEName='HANABI', GameName='花火祭', TheirGameId='AWS_14', GameVendor=62,GameType=2;
INSERT INTO Game_List SET GameEName='TIKI JENGA', GameName='天降提基', TheirGameId='AWS_15', GameVendor=62,GameType=2;
INSERT INTO Game_List SET GameEName='MONSTER 7', GameName='怪7物语', TheirGameId='AWS_16', GameVendor=62,GameType=2;
INSERT INTO Game_List SET GameEName='LORD OF THE DEAD', GameName='阿努比斯', TheirGameId='AWS_17', GameVendor=62,GameType=2;
INSERT INTO Game_List SET GameEName='MAHJONG', GameName='方城啾啾', TheirGameId='AWS_18', GameVendor=62,GameType=2;
INSERT INTO Game_List SET GameEName='GACHA BALL', GameName='毛毛扭蛋', TheirGameId='AWS_19', GameVendor=62,GameType=2;
INSERT INTO Game_List SET GameEName='OH!PARTY!', GameName='噢!派对!', TheirGameId='AWS_20', GameVendor=62,GameType=2;
INSERT INTO Game_List SET GameEName='MONSTER FOOTBALL', GameName='怪兽足球', TheirGameId='AWS_21', GameVendor=62,GameType=2;
INSERT INTO Game_List SET GameEName='MEDUSA', GameName='美杜莎', TheirGameId='AWS_22', GameVendor=62,GameType=2;
INSERT INTO Game_List SET GameEName='SNAIL RACING', GameName='蜗牛赛跑', TheirGameId='AWS_23', GameVendor=62,GameType=2;
INSERT INTO Game_List SET GameEName='NEON CAT', GameName='霓虹猫', TheirGameId='AWS_24', GameVendor=62,GameType=2;
INSERT INTO Game_List SET GameEName='CHARMING 5', GameName='五媚娘', TheirGameId='AWS_25', GameVendor=62,GameType=2;
INSERT INTO Game_List SET GameEName='UNDERGROUND THIEVES', GameName='遁地大盗', TheirGameId='AWS_26', GameVendor=62,GameType=2;
INSERT INTO Game_List SET GameEName='ALLWAY HEROES', GameName='全能英雄', TheirGameId='AWS_27', GameVendor=62,GameType=2;
INSERT INTO Game_List SET GameEName='OHYA FRUITS', GameName='哦耶水果盘', TheirGameId='AWS_28', GameVendor=62,GameType=2;
INSERT INTO Game_List SET GameEName='BUNNY CIRCUS', GameName='邦妮马戏团', TheirGameId='AWS_29', GameVendor=62,GameType=2;
INSERT INTO Game_List SET GameEName='ETERNAL DINO', GameName='龙物语', TheirGameId='AWS_30', GameVendor=62,GameType=2;
INSERT INTO Game_List SET GameEName='ALCHEMY', GameName='炼金术', TheirGameId='AWS_31', GameVendor=62,GameType=2;
INSERT INTO Game_List SET GameEName='GREEN LEPRECHAUN', GameName='幸运妖精', TheirGameId='AWS_32', GameVendor=62,GameType=2;
INSERT INTO Game_List SET GameEName='PHOENIX RISE', GameName='浴火重生', TheirGameId='AWS_33', GameVendor=62,GameType=2;
INSERT INTO Game_List SET GameEName='GOLDEN ISLAND', GameName='秘宝奇航', TheirGameId='AWS_34', GameVendor=62,GameType=2;
INSERT INTO Game_List SET GameEName='GOD OF EGYPTIAN', GameName='埃及战队', TheirGameId='AWS_35', GameVendor=62,GameType=2;
INSERT INTO Game_List SET GameEName='HELLOWIN', GameName='万胜节', TheirGameId='AWS_36', GameVendor=62,GameType=2;
INSERT INTO Game_List SET GameEName='TONY STAR', GameName='钢铁星', TheirGameId='AWS_37', GameVendor=62,GameType=2;
INSERT INTO Game_List SET GameEName='JOKER', GameName='小丑', TheirGameId='AWS_38', GameVendor=62,GameType=2;
INSERT INTO Game_List SET GameEName='GOLDEN BULL', GameName='鸿运金牛', TheirGameId='AWS_39', GameVendor=62,GameType=2;

INSERT INTO `platform_db`.`report_group_desc` (`GroupID`, `Depiction`, `sqlstr`)
VALUES
  (92, 'AWS', 'INSERT INTO report_group (`GroupId`, `GameId`) SELECT 92, GameId FROM Game_List WHERE GameVendor = 62 AND GameType = 2;');


INSERT INTO `platform_db`.`member_fanshui_rate_setup` (
  `GameVendor`,
  `YouXiaoTouZhu`,
  `FanShuiRate`
)
VALUES
  (62,'1000000','0.70'),
  (62,'200000','0.60'),
  (62,'1000','0.50');
