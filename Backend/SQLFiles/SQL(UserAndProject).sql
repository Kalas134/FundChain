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

create table Projects (
    PROJECT_ID BIGSERIAL PRIMARY KEY,

    CREATOR_ID varchar(10) not null, --USER_ROLE : Creator에만 해당되는 사람들

    TITLE varchar(100) not null,
    SHORT_DESC varchar(200) not null,

    TARGET_AMOUNT BIGINT not null,

    START_DATE date not null,
    END_DATE date not null,

    PROJECT_STATUS varchar(20) not null,

    CREATED_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT Fk_Projects_Users
        FOREIGN KEY (CREATOR_ID)
        REFERENCES Users(USERID)
);

create table ProjectContent (
    CONTENT_ID BIGSERIAL PRIMARY KEY,

    PROJECT_ID BIGINT not null,

    CONTENT TEXT not null,

    IMAGE_URL varchar(255),

    CREATED_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT Fk_ProjectContent_Projects
        FOREIGN KEY (PROJECT_ID)
        REFERENCES Projects(PROJECT_ID)
        ON DELETE CASCADE
);