# Research-Nexas
A web application that seamlessly connects students and researchers with stakeholders in a collaborative research ecosystem. Students enter their academic details and preferences, gaining access to a rich repository of categorized research topics by department and difficulty level. Personalization takes center stage, as the platform uses user data to recommend topics perfectly aligned with individual aspirations. A comprehensive student progress tracking system keeps users informed about their research journey, while also granting access to previous years' research papers. Dissertation quality is ensured through predefined evaluation criteria, with a built-in plagiarism checker to maintain integrity. The platform facilitates seamless collaboration: students can search and upload research papers, engage with peers, faculty, and seniors, and clarify doubts through topic-specific chats. Stakeholders can review and approve research submissions while setting their evaluation criteria. Disapproved students' results are revealed post-approval. To further simplify the research process, AI-generated templates are provided, adhering to institute guidelines.
<b>Develop an application enabling student signup, login, and paper uploads. Future features include progress tracking, stakeholder approval based on predefined criteria, and immediate or deferred result declaration for approved or unsuccessful papers.</b>

# Running the Application

Follow these steps to run the Research Nexas

- Clone this repository in your computer
- Establishing the database in MySQL Workbench
  - Open MySQL workbench and run these queries one by one
    
     ```
     CREATE SCHEMA user_db;
     ```
     ```
     CREATE TABLE `user_db`.`user_table` (
       `userid` int NOT NULL AUTO_INCREMENT,
       `username` varchar(70) NOT NULL,
       `email` varchar(120) NOT NULL,
       `password` varchar(100) NOT NULL,
       PRIMARY KEY (`userid`)
    ) 
     ```
     ```
     CREATE TABLE `user_db`.`upload_file_db` (
       `userid` int NOT NULL,
       `filename` varchar(120) NOT NULL,
       `filepath` varchar(250) NOT NULL,
       PRIMARY KEY (`userid`)
    )
     ```
     ```
     CREATE TABLE `user_db`.`info_table` (
       `id` int NOT NULL,
       `name` varchar(60) DEFAULT NULL,
       `email` varchar(80) NOT NULL,
       `col_name` varchar(160) NOT NULL,
       `state` varchar(80) NOT NULL,
       `year` int NOT NULL,
       `course` varchar(100) NOT NULL,
       PRIMARY KEY (`id`)
    )
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



