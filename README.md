# Research-Nexas
A web application that seamlessly connects students and researchers with stakeholders in a collaborative research ecosystem. Students can login and enter their details, upload their research paper and view thier uploads.They can see thier result on the uploaded paper in profile and can view their details and Evaluation Criteria set by the stakeholder. The stakeholder can approve the Research paper submitted by their students and can allot the papers to the faculty he wants, Stakeholder set evaluation criteria and can see the saved criteria on their profile. Faculty can view the alloted papers and csn evaluate the papers and give rating, the result is evauated on the basis of the evaluation criteria
<h4>Upcoming Feature</h4>
User can get a personalized recommendation on choosing topic on which he want to do research
<strong>Note:</strong> Websie Content is not ready

# Working
- Student
<iframe width="853" height="480" src="https://www.youtube.com/embed/Twn3xGyIvSM?autoplay=1" title="user page" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

- Stakeholder
   <iframe width="853" height="480" src="https://www.youtube.com/embed/9n1egHJgng8?autoplay=1" title="stk page" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
  

- Faculty
  <iframe width="1045" height="448" src="https://www.youtube.com/embed/S3RVG8TsQ9k?autoplay=1" title="faculty page" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
  
- Result
  <iframe width="853" height="480" src="https://www.youtube.com/embed/FGV4lsQPkwo?autoplay=1" title="result page" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


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



