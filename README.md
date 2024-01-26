# Research-Nexas
A web application that seamlessly connects students and researchers with stakeholders in a collaborative research ecosystem. Students enter their academic details and preferences, gaining access to a rich repository of categorized research topics by department and difficulty level. Personalization takes center stage, as the platform uses user data to recommend topics perfectly aligned with individual aspirations. A comprehensive student progress tracking system keeps users informed about their research journey, while also granting access to previous years' research papers. Dissertation quality is ensured through predefined evaluation criteria, with a built-in plagiarism checker to maintain integrity. The platform facilitates seamless collaboration: students can search and upload research papers, engage with peers, faculty, and seniors, and clarify doubts through topic-specific chats. Stakeholders can review and approve research submissions while setting their evaluation criteria. Disapproved students' results are revealed post-approval. To further simplify the research process, AI-generated templates are provided, adhering to institute guidelines.
<b>Develop an application enabling student signup, login, and paper uploads. Future features include progress tracking, stakeholder approval based on predefined criteria, and immediate or deferred result declaration for approved or unsuccessful papers.</b>

# Running the Application

Follow these steps to run the Research Nexas

- Clone this repository in your computer
- Establishing the database in MySQL Workbench
  - Open MySQL workbench and run these queries
    
     ```
     CREATE SCHEMA user_db;
     use user_db;
     ```
     ```
     create table user_table(
     userid INT auto_increment unique primary key,
     username varchar(60) not null,
     email varchar(80) not null unique,
     password varchar(140) not null unique
     );
     ```
     ```
     create table upload_file_db(
     sno int auto_increment unique primary key,
     userid int not null,
     filename varchar(160) not null unique,
     filepath varchar(220) not null unique,
     status boolean default false,
     fac_mail varchar(80) default null,
     foreign key(fac_mail) references faculty(email) on delete cascade,
     foreign key(userid) references info_table(id) on delete cascade
     );
     ```
     ```
     create table info_table(
     id int unique not null primary key,
     name varchar(70) not null,
     email varchar(80) not null unique,
     col_name varchar(180) not null,
     state varchar(80) not null,
     year int not null,
     course varchar(100) not null,
     foreign key(id) references user_table(userid) on delete cascade
     );
     ```
     ```
     create table stk_holder(
     id int not null auto_increment primary key,
     col_name varchar(180) not null,
     email varchar(80) not null unique,
     password varchar(80) not null unique
     );

     ```
     ```
     create table criteria(
     stk_id int not null unique,
     college varchar(100) not null,
     level1 int not null,
     level2 int not null,
     level3 int not null,
     level4 int not null,
     topic varchar(200) default null,
     level5 int default null,
     foreign key(stk_id) references stk_holder(id) on delete cascade  
     );
     ```
     ```
     create table result(
     resultid int not null auto_increment primary key,
     result float default null,
     userid int not null,
     topic1 int not null,
     topic2 int not null,
     topic3 int not null,
     topic4 int not null,
     topic5 int default null,
     foreign key (userid) references user_table(userid) on delete cascade
     );
     ```
- Now open code editor(eg. VS Code)
- make a .env file and add the following data to this file
  ```
  DB_HOST=127.0.0.1 //your default host
  DB_USER=root // your user name(by default root)
  DB_PASSWORD=mypassword // your password 
  DB_DATABASE=user_db
  DB_PORT=3306 // databse port
  ACCESS_TOKEN_SECRET = 3a9af42de397cfc9387a06972c28c23a1ac7e9a60fb6dc1f05295bc6057baf500672d4a13db5d04ea84bbc4c5679164a7723f3d49f516bb73dc3df6e3b768c8e
  EMAIL='harsh@gmail.com'   // your email
  MYPASS='yourmailpassword' 
  ```
- Now run the following commands in your terminal
  ```
  npm install
  ```
  ```
  cd dbSever.js
  ```
  ```
  nodemon dbServer.js
  ```

- Click the link shown in terminal or open your browser and search for-
  ```
  http://localhost:3000
  ```



