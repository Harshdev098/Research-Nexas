# Research-Nexas aditya
A web application that seamlessly connects students and researchers with stakeholders in a collaborative research ecosystem. Students can login and enter their details, upload their research paper and view thier uploads.They can see thier result in profile and can view their details and Evaluation Criteria set by the stakeholder. The stakeholder can approve the Research paper submitted by their students and can allot the papers to the faculty he wants, Stakeholder set evaluation criteria and can see the saved criteria on their profile. Faculty can view the alloted papers and csn evaluate the papers and give rating, the result is evaluated on the basis of the evaluation criteria 

# Working
- Student

  https://github.com/Harshdev098/Research-Nexas/assets/118347330/a26c3b7c-684a-4830-8f11-daf4dac5e8a2

- Stakeholder

  https://github.com/Harshdev098/Research-Nexas/assets/118347330/c6aa876b-095a-4c07-8eea-f402a63bb7bd

- Faculty

  https://github.com/Harshdev098/Research-Nexas/assets/118347330/4106eb28-7931-4adb-9732-a6285ef944c8
  
- Result

  https://github.com/Harshdev098/Research-Nexas/assets/118347330/5b581f5c-5887-4f06-be86-f5fb5cfb68af


# Prerequisite
- MySQL
- NPM & Nodejs


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
     ```
     create table faculty(
     email varchar(80) not null unique primary key,
     name varchar(60),
     password varchar(120) unique,
     token varchar(130) not null unique
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
- You can find `yourmailpassword` for low protected app(developer use) here- https://youtu.be/nuD6qNAurVM
- Now run the following commands in your terminal
  ```
  npm install
  ```
  ```
  cd login-system
  ```
  ```
  nodemon dbServer.js
  ```

- Click the link shown in terminal or open your browser and search for-
  ```
  http://localhost:3000
  ```

# Contribution
Welcome to Research Nexas build for researchers, before contributing to the project please go through our contribution guidelines [Contributing.md](Contributing.md#Opening-a-pull-request). If you have any doubts about guidelines, please open an issue regarding that , we will help for it. **Your PR should follow [Contributing.md](Contributing.md#Opening-a-pull-request) guidelines**.

# Code of Conduct
This project follows [Code of Conduct](Code_of_Conduct.md)




Star ⭐ the project if you like it,working and contributing with us ❤️.


# Big thanks to all the contributors!

<a href="https://github.com/Harshdev098/Research-Nexas/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Harshdev098/Research-Nexas" />
</a>

