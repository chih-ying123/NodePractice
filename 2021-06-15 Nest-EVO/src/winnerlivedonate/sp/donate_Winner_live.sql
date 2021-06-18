CREATE OR REPLACE TABLE donate_Winner_live (
	`id` 		BIGINT(20) UNSIGNED AUTO_INCREMENT,
	`buy_hash`	INT(10) UNSIGNED,
	
	`dept_id`	VARCHAR(10) COMMENT '部門代碼，LS2，LS1等等',
	`buyid` 	VARCHAR(50) COMMENT '注單編號，唯一值',
	`username` 	VARCHAR(45) COMMENT '會員名稱',
	`nickname` 	VARCHAR(45) COMMENT '會員暱稱',
	`gamename` 	VARCHAR(10) COMMENT '遊戲名稱',	
	`playkey` 	VARCHAR(20) COMMENT '遊戲種類-每一種視訊代碼， 需搭桌號 tablenum 例 A B C D 桌，例如 「 极速百家乐 A 桌」為 playkey = JSBJL，tablinum = A',
	`tablenum` 	VARCHAR(10) COMMENT '桌號',
	`money` 	DECIMAL(10,2) COMMENT '下注金額',
	`TIME` 		DATETIME COMMENT '打賞時間',
	
	`dealerid`	VARCHAR(45) COMMENT '荷官代碼',
	`dealername` VARCHAR(45) COMMENT '荷官名稱',
	`list_id` 	VARCHAR(45) COMMENT '打賞項目代號',
	`giftname` 	VARCHAR(45) COMMENT '打賞項目名稱',
	PRIMARY KEY (`id`),
	INDEX `IPX_buyi` (`buy_hash`)
)ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci; 

