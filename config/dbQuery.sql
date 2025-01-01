CREATE DATABASE IF NOT EXISTS user_DB;
USE user_DB;

-- Create the faculty table first
CREATE TABLE faculty (
    email VARCHAR(80) NOT NULL UNIQUE PRIMARY KEY,
    name VARCHAR(60),
    password VARCHAR(120) UNIQUE,
    token VARCHAR(130) NOT NULL UNIQUE
);

-- Create the user_table
CREATE TABLE user_table (
    userid INT AUTO_INCREMENT UNIQUE PRIMARY KEY,
    username VARCHAR(60) NOT NULL,
    email VARCHAR(80) NOT NULL UNIQUE,
    password VARCHAR(140) NOT NULL UNIQUE,
    otp VARCHAR(6) -- Add the otp column to store OTP values
);

-- Create the info_table
CREATE TABLE info_table (
    id INT UNIQUE NOT NULL PRIMARY KEY,
    name VARCHAR(70) NOT NULL,
    email VARCHAR(80) NOT NULL UNIQUE,
    col_name VARCHAR(180) NOT NULL,
    state VARCHAR(80) NOT NULL,
    year INT NOT NULL,
    course VARCHAR(100) NOT NULL,
    FOREIGN KEY (id) REFERENCES user_table(userid) ON DELETE CASCADE
);

-- Create the stk_holder table
CREATE TABLE stk_holder (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    col_name VARCHAR(180) NOT NULL,
    email VARCHAR(80) NOT NULL UNIQUE,
    password VARCHAR(80) NOT NULL UNIQUE
);

-- Create the criteria table
CREATE TABLE criteria (
    stk_id INT NOT NULL UNIQUE,
    college VARCHAR(100) NOT NULL,
    level1 INT NOT NULL,
    level2 INT NOT NULL,
    level3 INT NOT NULL,
    level4 INT NOT NULL,
    topic VARCHAR(200) DEFAULT NULL,
    level5 INT DEFAULT NULL,
    FOREIGN KEY (stk_id) REFERENCES stk_holder(id) ON DELETE CASCADE
);

-- Create the result table
CREATE TABLE result (
    resultid INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    result FLOAT DEFAULT NULL,
    userid INT NOT NULL,
    topic1 INT NOT NULL,
    topic2 INT NOT NULL,
    topic3 INT NOT NULL,
    topic4 INT NOT NULL,
    topic5 INT DEFAULT NULL,
    FOREIGN KEY (userid) REFERENCES user_table(userid) ON DELETE CASCADE
);

CREATE TABLE upload_file_db (
    sno INT AUTO_INCREMENT UNIQUE PRIMARY KEY,
    userid INT NOT NULL,
    filename VARCHAR(160) NOT NULL UNIQUE,
    filepath VARCHAR(220) NOT NULL UNIQUE,
    status BOOLEAN DEFAULT FALSE,
    fac_mail VARCHAR(80) DEFAULT NULL,
    FOREIGN KEY (fac_mail) REFERENCES faculty(email) ON DELETE CASCADE,
    FOREIGN KEY (userid) REFERENCES info_table(id) ON DELETE CASCADE
);
