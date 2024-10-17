# Research-Nexas 🌟🔬📚

**Research-Nexas** is a cutting-edge web application designed to create a seamless connection between **students**, **researchers**, and **stakeholders** within a collaborative research ecosystem. The platform empowers students to log in, upload their research papers, view their uploads, and track their evaluations. 🎓📝 They can also access their profile to see their research details and the **evaluation criteria** set by the stakeholder.

Stakeholders act as research supervisors who can **approve** student submissions and assign papers to the appropriate **faculty members** for evaluation. 👩‍🏫📑 Stakeholders also set evaluation criteria, which they can view on their profile. Faculty members, in turn, can review the assigned papers, provide ratings, and evaluate results based on predefined criteria.

This application creates a **dynamic, feedback-driven environment** where students can improve their research based on faculty evaluations, and stakeholders can ensure quality through customizable criteria. 🌱✨

With **Research-Nexas**, the future of research collaboration is smarter, faster, and more impactful. 💡📈

<p align="center">
  <img src="https://raw.githubusercontent.com/alo7lika/Research-Nexas/refs/heads/main/Research-Nexas%20-%20Application%20Architecture.png" alt="Research-Nexas Application Architecture" width="500"/>
</p>

## 📚 Table of Contents

- [Technical Stack](#teachnicalStack)
- [Working](#working)
  - [Student](#student)
  - [Stakeholder](#stakeholder)
  - [Faculty](#faculty)
  - [Result](#result)
- [Prerequisite](#prerequisite)
- [Running the Application](#running-the-application)
- [Future Enhancements / Roadmap](#featureEnhancementsRoadMap)
- [API Documentation](#ApiDocumentation)
- [License](#licenseR)
- [Contribution](#contribution)
- [Code of Conduct](#code-of-conduct)

<a name="teachnicalStack"></a>
## 🛠️ Technical Stack


| **Technology**      | **Description**                                           |
|---------------------|-----------------------------------------------------------|
| **🌐 Frontend**     | HTML, CSS, JavaScript (framework/library not specified)   |
| **🔙 Backend**      | Node.js, Express                                          |
| **💾 Database**     | MySQL                                                    |
| **🧪 Version Control** | Git                                                  |
| **📦 Package Manager** | npm                                                 |
| **💻 Environment**  | Development with VS Code                                |



## Working
<a name="student"></a>
- Student

  https://github.com/Harshdev098/Research-Nexas/assets/118347330/a26c3b7c-684a-4830-8f11-daf4dac5e8a2

<a name="stakeholder"></a>
- Stakeholder

  https://github.com/Harshdev098/Research-Nexas/assets/118347330/c6aa876b-095a-4c07-8eea-f402a63bb7bd

<a name="faculty"></a>
- Faculty

  https://github.com/Harshdev098/Research-Nexas/assets/118347330/4106eb28-7931-4adb-9732-a6285ef944c8
  
<a name="result"></a>
- Result

  https://github.com/Harshdev098/Research-Nexas/assets/118347330/5b581f5c-5887-4f06-be86-f5fb5cfb68af


## Prerequisite
- MySQL
- NPM & Nodejs


### Running the Application

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
- Now run the following commands in your terminal
  ```
  npm install
  ```
  ```
  cd login-system
  ```
- make a `.env` file in `login-system` folder and add the following data to this file
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
- Run the following command
  ```
  nodemon dbServer.js
  ```
- Click the link shown in terminal or open your browser and search for-
  ```
  http://localhost:3000
  ``` 
- If you encounter an error `Client does not support authentication protocol requested by server; consider upgrading MySQL client`, then open MySQL workbench and run these queries for resetting your mysql root password
  
  ```
  ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_new_password';
  ```
  ```
  flush privileges;
  ```
  - To know more about this error check stackoverflow here- https://stackoverflow.com/questions/50093144/mysql-8-0-client-does-not-support-authentication-protocol-requested-by-server
  - Re-run the following command
    ```
    nodemon dbServer.js
    ```
  - Click the link shown in terminal or open your browser and search for-
    ```
    http://localhost:3000
    ``` 

<a name="featureEnhancementsRoadMap"></a>
## 🛣️ Future Enhancements / Roadmap

| **🗓️ Timeline** | **✨ Milestone**                             | **📝 Description**                                                                                                   |
|-----------------|---------------------------------------------|----------------------------------------------------------------------------------------------------------------------|
| **Q4 2024**     | **📊 User Dashboard Improvements**          | Enhance user dashboards with detailed research analytics, including version control for uploaded research papers.    |
| **Q1 2025**     | **💬 Enhanced Faculty-Student Interaction** | Implement real-time chat and discussion boards for faculty-student collaboration on research topics.                 |
| **Q2 2025**     | **🤖 Research Evaluation System Enhancements** | Introduce AI-based evaluation assistance for grading research papers based on predefined criteria.                   |
| **Q4 2025**     | **🌍 Internationalization and Localization** | Enable multi-language support to expand the platform’s reach to a global audience.                                   |
| **Q1 2026**     | **📚 Publication and Citation Tracking**    | Integrate publication tracking to help users manage where their papers are published and track citations in real-time.|

🚀 **Stay tuned for more updates and exciting features!**

<a name="ApiDocumentation"></a>
## API Documentation 📚

The Research Nexas application communicates with a backend API to manage various functionalities. Here’s a brief overview of the available API endpoints:

| HTTP Method | Endpoint                    | Description                                             |
|-------------|-----------------------------|---------------------------------------------------------|
| POST        | `/api/register`             | ✍️ Registers a new student or stakeholder.                 |
| POST        | `/api/login`                | 🔐 Logs in a user (student, faculty, or stakeholder).     |
| POST        | `/api/upload`               | 📤 Allows students to upload their research papers.        |
| GET         | `/api/uploads/:userId`      | 📄 Fetches all uploads for a specific user.                |
| POST        | `/api/evaluate`             | ⭐ Submits evaluations and ratings from faculty.           |
| GET         | `/api/criteria/:stkId`      | 📊 Fetches evaluation criteria set by the stakeholder.     |
| POST        | `/api/criteria`             | 🏷️ Sets evaluation criteria by the stakeholder.            |
| GET         | `/api/results/:userId`      | 📈 Fetches evaluation results for a specific user.        |


<a name="licenseR"></a>
## License 📝
This project is licensed under the **[MIT License](LICENSE)**. 

## Contribution
Welcome to Research Nexas build for researchers, before contributing to the project please go through our contribution guidelines [Contributing.md](Contributing.md#Opening-a-pull-request). If you have any doubts about guidelines, please open an issue regarding that , we will help for it. **Your PR should follow [Contributing.md](Contributing.md#Opening-a-pull-request) guidelines**.

## Code of Conduct
This project follows [Code of Conduct](Code_of_Conduct.md)




Star ⭐ the project if you like it,working and contributing with us ❤️.


# Big thanks to all the contributors!

<a href="https://github.com/Harshdev098/Research-Nexas/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Harshdev098/Research-Nexas" />
</a>

