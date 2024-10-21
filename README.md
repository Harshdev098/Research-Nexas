# <p>**Research-Nexas 🌟🔬📚**
<img  src="https://readme-typing-svg.herokuapp.com?color=45ffaa&size=40&width=900&height=80&lines=Welcome-to-Research-Nexas"/>
</p>

**Research-Nexas** is a cutting-edge web application designed to create a seamless connection between **students**, **researchers**, and **stakeholders** within a collaborative research ecosystem. The platform empowers students to log in, upload their research papers, view their uploads, and track their evaluations. 🎓📝 They can also access their profile to see their research details and the **evaluation criteria** set by the stakeholder.

Stakeholders act as research supervisors who can **approve** student submissions and assign papers to the appropriate **faculty members** for evaluation. 👩‍🏫📑 Stakeholders also set evaluation criteria, which they can view on their profile. Faculty members, in turn, can review the assigned papers, provide ratings, and evaluate results based on predefined criteria.

This application creates a **dynamic, feedback-driven environment** where students can improve their research based on faculty evaluations, and stakeholders can ensure quality through customizable criteria. 🌱✨

With **Research-Nexas**, the future of research collaboration is smarter, faster, and more impactful. 💡📈

<table align="center">
    <thead align="center">
        <tr border: 2px;>
            <td><b>🌟 Stars</b></td>
            <td><b>🍴 Forks</b></td>
            <td><b>🐛 Issues</b></td>
            <td><b>🔔 Open PRs</b></td>
            <td><b>🔕 Close PRs</b></td>
        </tr>
     </thead>
    <tbody>
      <tr>
          <td><img alt="Stars" src="https://img.shields.io/github/stars/Harshdev098/Research-Nexas?style=flat&logo=github"/></td>
          <td><img alt="Forks" src="https://img.shields.io/github/forks/Harshdev098/Research-Nexas?style=flat&logo=github"/></td>
          <td><img alt="Issues" src="https://img.shields.io/github/issues/Harshdev098/Research-Nexas?style=flat&logo=github"/></td>
          <td><img alt="Open Pull Requests" src="https://img.shields.io/github/issues-pr/Harshdev098/Research-Nexas?style=flat&logo=github"/></td>
          <td><img alt="Closed Pull Requests" src="https://img.shields.io/github/issues-pr-closed/Harshdev098/Research-Nexas?style=flat&color=critical&logo=github"/></td>
      </tr>
    </tbody>
</table>
<hr/>
<br/>
<p align="center">
  <img src="https://raw.githubusercontent.com/alo7lika/Research-Nexas/refs/heads/main/Research-Nexas%20-%20Application%20Architecture.png" alt="Research-Nexas Application Architecture" width="500"/>
</p>

<img src="https://raw.githubusercontent.com/alo7lika/Research-Nexas/refs/heads/main/Image/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="900">

### This project is now OFFICIALLY accepted for

<div align="center">
  <img src="https://raw.githubusercontent.com/alo7lika/Research-Nexas/refs/heads/main/Image/329829127-e79eb6de-81b1-4ffb-b6ed-f018bb977e88.png" alt="GSSoC 2024 Extd" width="80%">
</div>

<div align="center">
  <img src="https://raw.githubusercontent.com/alo7lika/Research-Nexas/refs/heads/main/Image/hacktober.png" alt="Hacktober fest 2024" width="80%">
</div>

<br>

<img src="https://raw.githubusercontent.com/alo7lika/Research-Nexas/refs/heads/main/Image/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="900">


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
- [Contributors](#contributors)
- [Code of Conduct](#code-of-conduct)
- 📞 [Contact Information](#contact-information)

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

## Contributors

We are grateful to all the contributors who have collaborated on this project. Their efforts, dedication, and creativity have significantly enhanced our work. Below is the list of contributors along with their GitHub profiles:

<div align="center">

| Contributor                                                                                      | Contributor                                                                                      | Contributor                                                                                      | Contributor                                                                                      |
|--------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| <img src="https://github.com/Harshdev098.png" alt="Harshdev098" width="80"/> <br> <p align="center">[Harshdev098](https://github.com/Harshdev098) 👨‍💻</p> | <img src="https://github.com/ygowthamr.png" alt="Ygowthamr" width="80"/> <br> <p align="center">[Ygowthamr](https://github.com/ygowthamr) 👨‍💻</p> | <img src="https://github.com/Ankitha2130.png" alt="Ankitha2130" width="80"/> <br> <p align="center">[Ankitha2130](https://github.com/Ankitha2130) 👩‍💻</p> | <img src="https://github.com/alo7lika.png" alt="Alolika" width="80"/> <br> <p align="center">[Alolika](https://github.com/alo7lika) 👩‍💻</p> |
| <img src="https://github.com/T-Rahul-prabhu-38.png" alt="T Rahul Prabhu" width="80"/> <br> <p align="center">[T Rahul Prabhu](https://github.com/T-Rahul-prabhu-38) 👨‍💻</p> | <img src="https://github.com/trinetra110.png" alt="Trinetra" width="80"/> <br> <p align="center">[Trinetra](https://github.com/trinetra110) 👩‍💻</p> | <img src="https://github.com/RishiVT2004.png" alt="Rishi" width="80"/> <br> <p align="center">[Rishi](https://github.com/RishiVT2004) 👨‍💻</p> | <img src="https://github.com/smog-root.png" alt="Smog Root" width="80"/> <br> <p align="center">[Smog Root](https://github.com/smog-root) 👨‍💻</p> |
| <img src="https://github.com/harish08102004.png" alt="Harish" width="80"/> <br> <p align="center">[Harish](https://github.com/harish08102004) 👨‍💻</p> | <img src="https://github.com/ragini-gp.png" alt="Ragini" width="80"/> <br> <p align="center">[Ragini](https://github.com/ragini-gp) 👩‍💻</p> | <img src="https://github.com/KapuluruBhuvaneswariVspdbct.png" alt="Bhuvaneswari" width="80"/> <br> <p align="center">[Bhuvaneswari](https://github.com/KapuluruBhuvaneswariVspdbct) 👩‍💻</p> | <img src="https://github.com/Shweta-1902.png" alt="Shweta" width="80"/> <br> <p align="center">[Shweta](https://github.com/Shweta-1902) 👩‍💻</p> |
| <img src="https://github.com/SoumyaU25.png" alt="Soumya" width="80"/> <br> <p align="center">[Soumya](https://github.com/SoumyaU25) 👩‍💻</p> | <img src="https://github.com/shubhagarwal1.png" alt="Shubham Agarwal" width="80"/> <br> <p align="center">[Shubham Agarwal](https://github.com/shubhagarwal1) 👨‍💻</p> | <img src="https://github.com/MrunalKashid02.png" alt="Mrunal Kashid" width="80"/> <br> <p align="center">[Mrunal Kashid](https://github.com/MrunalKashid02) 👩‍💻</p> | <img src="https://github.com/siri-chandana-macha.png" alt="Siri Chandana" width="80"/> <br> <p align="center">[Siri Chandana](https://github.com/siri-chandana-macha) 👩‍💻</p> |
| <img src="https://github.com/MitulSonagara.png" alt="Mitul Sonagara" width="80"/> <br> <p align="center">[Mitul Sonagara](https://github.com/MitulSonagara) 👨‍💻</p> | <img src="https://github.com/Dipanita45.png" alt="Dipanita" width="80"/> <br> <p align="center">[Dipanita](https://github.com/Dipanita45) 👩‍💻</p> | <img src="https://github.com/Gauravtb2253.png" alt="Gaurav" width="80"/> <br> <p align="center">[Gaurav](https://github.com/Gauravtb2253) 👨‍💻</p> | <img src="https://github.com/Anu27n.png" alt="Anu" width="80"/> <br> <p align="center">[Anu](https://github.com/Anu27n) 👩‍💻</p> |
| <img src="https://github.com/ishita-1305.png" alt="Ishita" width="80"/> <br> <p align="center">[Ishita](https://github.com/ishita-1305) 👩‍💻</p> | <img src="https://github.com/Sudhanshu248.png" alt="Sudhanshu" width="80"/> <br> <p align="center">[Sudhanshu](https://github.com/Sudhanshu248) 👨‍💻</p> | <img src="https://github.com/Hamza1821.png" alt="Hamza" width="80"/> <br> <p align="center">[Hamza](https://github.com/Hamza1821) 👨‍💻</p> | <img src="https://github.com/Ajay-singh1.png" alt="Ajay Singh" width="80"/> <br> <p align="center">[Ajay Singh](https://github.com/Ajay-singh1) 👨‍💻</p> |
| <img src="https://github.com/archanasingh11.png" alt="Archana Singh" width="80"/> <br> <p align="center">[Archana Singh](https://github.com/archanasingh11) 👩‍💻</p> | <img src="https://github.com/tanya-soni-git.png" alt="Tanya Soni" width="80"/> <br> <p align="center">[Tanya Soni](https://github.com/tanya-soni-git) 👩‍💻</p> | <img src="https://github.com/jvkousthub.png" alt="Kousthub" width="80"/> <br> <p align="center">[Kousthub](https://github.com/jvkousthub) 👨‍💻</p> | <img src="https://github.com/Dinkar850.png" alt="Dinkar" width="80"/> <br> <p align="center">[Dinkar](https://github.com/Dinkar850) 👨‍💻</p> |
| <img src="https://github.com/Sarthak1970.png" alt="Sarthak" width="80"/> <br> <p align="center">[Sarthak](https://github.com/Sarthak1970) 👨‍💻</p> | <img src="https://github.com/Pks0110.png" alt="Pks" width="80"/> <br> <p align="center">[Pks](https://github.com/Pks0110) 👨‍💻</p> | <img src="https://github.com/ADeshmukh80.png" alt="ADeshmukh" width="80"/> <br> <p align="center">[ADeshmukh](https://github.com/ADeshmukh80) 👨‍💻</p> | <img src="https://github.com/ash-k121.png" alt="Ash" width="80"/> <br> <p align="center">[Ash](https://github.com/ash-k121) 👨‍💻</p> |

</div>

## Code of Conduct
This project follows [Code of Conduct](Code_of_Conduct.md)
Star ⭐ the project if you like it,working and contributing with us ❤️.

## 📞 **Contact Information**

### Project Admin⚡

<table>
<tr>
  <td align="center">
    <a href="https://github.com/Harshdev098/">
      <img src="https://avatars.githubusercontent.com/u/118347330?v=4" width="150px" height="150px" />
    </a>
    <br />
    <h4 style="color:red;">HARSH DEV PATHAK</h4>
    <a href="https://www.linkedin.com/in/harsh-dev-pathak-60a426257/">
      <img src="https://img.icons8.com/fluency/2x/linkedin.png" width="32px" height="32px"></img>
    </a>
    <a href="https://x.com/Harsh_dev098?t=EyUvr1QvMSpco9QB6k72iw&s=09">
      <img src="https://img.icons8.com/fluency/2x/twitter.png" width="32px" height="32px"></img>
    </a>
  </td>
</tr>
</table>


#### Got questions? Want to suggest improvements? Open an issue on GitHub or contact the project admin, **Harsh Dev**, at:  
📧 **harshoxfordgkp@gmail.com**

---

# Big thanks to all the contributors!
