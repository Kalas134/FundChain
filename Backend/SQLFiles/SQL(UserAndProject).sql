SELECT current_database();

-- User table

create table Users (
	USERCREATER BOOLEAN, -- True: user // False: Creater
	USERID varchar(10),
	NICKNAME varchar(20) not null,
	PASSWORD varchar(30) not null,
	USERNAME varchar(20) not  null,
	BIRYHDATE DATE not null,
	PHONENUM varchar(10) not null,
	EMAIL varchar(10) not null,
	ACCOUNTNUM varchar(25),
	-- 전부 임시임 회의 필요
	primary key (USERCREATER, USERID)
);