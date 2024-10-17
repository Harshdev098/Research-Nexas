const mysql = require("mysql");
const notify = require("../login-system/notification");
const { decodeAccessToken } = require("../login-system/token");
const { registrationToken } = require("../login-system/token");
require("dotenv").config();
const db = require("../config/mysql_connection");

// allot research papers to the faculty
const allot = async (req, res) => {
  const email = req.body.email;
  console.log(email);
  const paperid = req.query.id;
  await db.getConnection(async (err, connection) => {
    if (err) throw err;
    const search = "SELECT * FROM faculty WHERE email=?";
    const searchquery = mysql.format(search, [email]);
    await connection.query(searchquery, async (err, result) => {
      if (err) throw err;
      if (result.length != 0) {
        const update = "update upload_file_db set fac_mail=? where sno=?";
        const updatequery = mysql.format(update, [email, paperid]);
        await connection.query(updatequery, async (err, result) => {
          if (err) throw err;
          console.log("table updated");
          res.sendStatus(200);
        });
      } else {
        const token = registrationToken(email);
        console.log(token);
        const insert = mysql.format(
          "insert into faculty values(?,null,null,?)",
          [email, token]
        );
        await connection.query(insert, async (err, result) => {
          if (err) throw err;
          const sub = "Allotment- Research Nexas";
          const link = `/fac_signup?token=${registrationToken(email)}`;
          const content = `Stakeholder of your college have register you to the research nexas with this mailid ${email} click here to complete this registration ${link}`;
          await notify(req, res, email, sub, content);
          const update = mysql.format(
            "update upload_file_db set fac_mail=? where sno=?",
            [email, paperid]
          );
          await connection.query(update, async (err, result) => {
            if (err) throw err;
            console.log("table updated");
            res.sendStatus(200);
          });
        });
      }
    });
  });
};

// displaying the papers to the stkeholder
const DisplayPapers = async (req, res) => {
  const decodedToken = decodeAccessToken(req.headers.authorization);
  if (!decodedToken || !decodedToken.user) {
    console.error("Invalid or missing user information in the token");
    return res.status(401).send("Unauthorized");
  }
  const userid = decodedToken.user;
  await db.getConnection(async (err, connection) => {
    if (err) throw err;
    const query = mysql.format("select * from stk_holder where id=?", [userid]);
    await connection.query(query, async (err, result) => {
      if (err) throw err;
      if (result.length != 0) {
        const col_name = result[0].col_name;
        const display =
          "select up.status,up.sno,info.name,info.email,up.filename,up.filepath,info.col_name from upload_file_db as up inner join info_table as info on up.userid=info.id";
        await connection.query(display, (err, files) => {
          if (err) throw err;
          const matchingFiles = files.filter(
            (file) => file.col_name === col_name
          );
          const fileData = matchingFiles.map((file) => ({
            filename: file.filename,
            name: file.name,
            collegename: file.col_name,
            status: file.status,
            id: file.sno,
          }));
          res.status(200).send(fileData);
        });
      }
    });
  });
};

module.exports = { allot, DisplayPapers };
