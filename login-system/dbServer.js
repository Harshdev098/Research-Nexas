const express = require("express");
const path = require("path");
const { upload, save, disp } = require(path.resolve(__dirname,"../file_upload/upload.js"));
const  db  = require('../config/mysql_connection')

const { stk_signup, stk_signin } = require("../stakeholder/login");
const { info, check } = require("../file_upload/form_db");
const { signup, signin } = require("./login");
const rateLimiter = require("express-rate-limit");
const { approve, uploadedpapers, displaydetail } = require("../stakeholder/stk_approval");
const { saveNewsLetterData } = require("../backend/newsLetter");
const { display,updateProfile } = require("../backend/profile");
const { stk_display } = require("../backend/stk_profile");
const { logout } = require("./logout");
const { setcriteria, evaluate } = require("../stakeholder/evaluation");
const { allot, DisplayPapers } = require("../stakeholder/allotment");
const { Dis_fac_papers, fac_signup, fac_login, dis_mail, giverating } = require("../stakeholder/faculty");
const app = express();

const globalLimit = rateLimiter({
  windowMs: 30 * 60 * 1000,
  max: 100,
  message: "Too amny request from same IP",
});

app.use(globalLimit);

app.post("/logout", logout);

// serving pages
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});
app.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login.html"));
});
app.get("/signup.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/signup.html"));
});
app.get("/main_page.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/main_page.html"));
});
app.get("/upload_file.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/upload_file.html"));
});
app.get("/stk_signup.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/stk_signup.html"));
});
app.get("/form_filling", async (req, res) => {
  await check(req, res);
});
app.get("/dashboard", async (req, res) => {
  await display(req, res);
});

app.use(express.json());
app.use(express.static("../file_upload/uploads"));

// serving ejs files
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");
app.get("/stk_papers", async (req, res) => {
  res.render("stk_papers");
});
app.post("/api/newsLetter/save", saveNewsLetterData);
app.get("/api/stk_papers", uploadedpapers); //displaying uploaded papers to the stakeholder during approval
app.get("/api/papers_detail", displaydetail); //displaying uploaded papers details to the stakeholder during approval
app.get("/allotment", DisplayPapers); //displaying papers
app.get("/fac_signup", (req, res) => {
  dis_mail(req, res); //displaying the email of the faculty on signup page
});

//fetch colleges
app.get('/search_colleges', (req, res) => {
  const query = req.query.q.toLowerCase();

  // Query to search for colleges in the `col_name` column
  const sql = `SELECT DISTINCT col_name AS name FROM info_table WHERE LOWER(col_name) LIKE ?`;
  
  // Use '%' to match any substring
  const searchTerm = `%${query}%`;

  db.query(sql, [searchTerm], (err, results) => {
      if (err) {
          console.error('Error fetching colleges:', err);
          return res.status(500).json({ error: 'Database query error' });
      }

      // Send the results as a JSON response
      res.json(results);
  });
});


// uploading files
app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    console.error("File upload failed");
    return res.status(500).send("File upload failed");
  }
  try {
    console.log("File uploaded successfully:", req.file.filename);
    await save(req, res);
    res.sendStatus(200);
  } catch (error) {
    console.error("Error during upload:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// uploading user information to database
app.post("/info", info);

// Updating profile in student dashboard
app.put("/updateProfile", updateProfile);

// serving uploaded research papers to the student
app.get("/uploaded_files", disp);

// creating users
app.post("/create_user", signup);
app.post("/stk_holder_signup", stk_signup);
app.post("/fac_signup", fac_signup); // registration of faculty

// login backend
app.post("/login", signin);
app.post("/stk_holder_signin", stk_signin);
app.post("/fac_login", fac_login); //login for faculty

// approval by stakeholder
app.get("/approval", approve);

// setting evaluation criteria
app.post("/evaluation", setcriteria);

// alloting papers to the faculty
app.post("/paper_allot", allot);

// sending papers to the alloted faculty
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../file_upload/uploads"))
);
app.get("/fac_papers", Dis_fac_papers);

// saving rating given by faculty
app.post("/rating", giverating);
app.get("/result", evaluate);

// displaying stk profile details
app.get("/stk_profile_detail", stk_display);
// app.get('/dis_criteria',dis_evaluation_criteria)

// starting the app on port
const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Server Started on port http://localhost:${port}`)
);
