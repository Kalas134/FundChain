SELECT current_database();

-- User table

create table Users (
	USERID varchar(10) PRIMARY KEY,
    USER_ROLE varchar(20) not null, -- User Creator admin
    PASSWORD varchar(100) not null,
	NICKNAME varchar(30) unique not null,
	USERNAME varchar(30) not null,
	BIRTHDATE DATE not null,
	PHONE_NUM varchar(20) not null,
	EMAIL varchar(100) not null,
    BANK_NAME varchar(30) not null,
	ACCOUNT_NUM varchar(25) not null
);

drop table Users;