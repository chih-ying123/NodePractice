CREATE OR REPLACE TABLE donate_Winner_lottery (
	`id` 		BIGINT(20) UNSIGNED AUTO_INCREMENT,
	`buy_hash`	INT(10) UNSIGNED,
	`dept_id`	VARCHAR(10) COMMENT '部門代碼，LS2，LS1等等',
	`buyid` 	VARCHAR(50) COMMENT '注單編號，唯一值',
	`TIME` 		DATETIME COMMENT '打賞時間',
	`username` 	VARCHAR(45) COMMENT '會員名稱',
	`playkey` 	VARCHAR(20) COMMENT '彩票種類',
	`list_id` 	VARCHAR(10) COMMENT '項目代碼',
	`listname`	VARCHAR(30) COMMENT '項目名稱',
	`camgirl_id` INT COMMENT '主播代碼',
	`girlname` 	VARCHAR(20) COMMENT '主播名稱',
	`money` 	DECIMAL(10,2) COMMENT '打賞金額',
	PRIMARY KEY (`id`),
	INDEX `IPX_buyi` (`buy_hash`)
)ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci; 



CREATE OR REPLACE TABLE report_donate_detail (
	`RowId` BIGINT(20) UNSIGNED AUTO_INCREMENT COMMENT '資料編號',
	`MemberId` INT(11) COMMENT '會員編號', 
	`UpId_L1` INT(11) COMMENT '大股東編號',
	`UpId_L2` INT(11) COMMENT '股東編號',
	`UpId_L3` INT(11) COMMENT '總代理編號',
	`UpId_L4` INT(11) COMMENT '代理',
	`GameVendor` INT(11) COMMENT '遊戲平台編號',
	`GameType` INT(11) COMMENT '遊戲類別',
	`GameId` INT(11) COMMENT '遊戲編號',
	`ZhuDanId` BIGINT(20) COMMENT '打賞單編號',
	`donate_id` INT(11) COMMENT '打賞部門編號',
	`money` BIGINT(20) UNSIGNED COMMENT '打賞金額',
	`CreateTime` DATETIME COMMENT '接收時間',
	`DonateTime` DATETIME COMMENT '打賞時間',
	PRIMARY KEY (`RowId`)
)ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci; 


CREATE OR REPLACE TABLE donate_id(
	`id` 		INT(20) UNSIGNED AUTO_INCREMENT,
	`key` 		VARCHAR(10),
	PRIMARY KEY (`id`)
)ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci; 

INSERT INTO donate_id(`id`,`key`)
VALUES
	(1,'Other'),
	(2,'LS1'),
	(3,'LS2');