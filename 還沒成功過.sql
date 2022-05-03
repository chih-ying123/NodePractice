/*
    SHOW VARIABLES LIKE '%CHARACTER%' ;
    SHOW VARIABLES LIKE '%conn%' ;
*/

SET NAMES utf8mb4 ;
DROP DATABASE emoj ;

CREATE DATABASE emoj DEFAULT CHARSET utf8mb4 ;
USE emoj;

-- SET @@character_set_client = 'utf8mb4' ;
-- SET @@character_set_connection = 'utf8mb4' ;
-- SET @@character_set_results = 'utf8mb4' ;

-- SET @@character_set_system = 'utf8mb4' ;
-- SET @@collation_connection = 'utf8mb4_general_ci'

DROP TABLE IF EXISTS t1 ;

CREATE TABLE t1 (
val NVARCHAR(32) 
) DEFAULT CHARSET utf8mb4 ;

INSERT INTO t1 (val) VALUES(N'🐷🤔🙄😂💩🤣😍😘') ;