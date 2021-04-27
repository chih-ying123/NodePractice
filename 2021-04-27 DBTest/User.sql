DROP TABLE IF EXISTS `User` ;

CREATE TABLE `User` (
    Id INT UNSIGNED NOT NULL AUTO_INCREMENT    
    , UserName      NVARCHAR(32)
    , UserAccount   VARCHAR(32)
    , UserPassword  VARCHAR(32)
    , Memo          NVARCHAR(512)
    , CreateDate    DATETIME    
    , PRIMARY KEY   (Id)
);

/*

INSERT INTO `User`
SET 
    UserName = ${}
    , UserAccount = ${}
    , UserPassword = MD5('123456')
    , Memo = ${}
    , CreateDate = CURRENT_TIMESTAMP ;
*/