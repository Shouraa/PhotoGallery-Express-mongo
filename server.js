const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fileUpload = require("express-fileupload");
const { MongoClient, ObjectID } = require("mongodb");
const url = "mongodb://localhost:27017/";
const myDB = "Integrify";
const myCollection = "students";

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/assets"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

app.use(bodyParser.json());

//index page
app.get("/", (req, res) => {
  MongoClient.connect(
    url,
    function(err, db) {
      if (err) throw err;
      var dbo = db.db(myDB);
      dbo
        .collection(myCollection)
        .find({})
        .toArray(function(err, result) {
          if (err) throw err;
          res.render("pages/index", { studentInfo: result });
          db.close();
        });
    }
  );
});

//Delete page
app.get("/delete/:_id", (req, res) => {
  MongoClient.connect(
    url,
    (err, db) => {
      if (err) throw err;
      const dbo = db.db(myDB);
      dbo
        .collection(myCollection)
        .deleteOne({ _id: new ObjectID(req.params._id) }, (err, result) => {
          if (err) throw err;
          res.redirect("/");
          db.close();
        });
    }
  );
});
//   studentInfo.splice(req.params.index, 1);
//   res.render("pages/index", { studentInfo });
// });

//detail page
app.get("/detail/:_id", (req, res) => {
  MongoClient.connect(
    url,
    (err, db) => {
      if (err) throw err;
      const dbo = db.db(myDB);
      dbo
        .collection(myCollection)
        .find({ _id: new ObjectID(req.params._id) })
        .toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          res.render("pages/detail", { student: result[0] });
          db.close();
        });
    }
  );
});

//add new student page
app.get("/addStudent", (req, res) => {
  res.render("pages/addStudent");
});

app.post("/addConfirm", (req, res) => {
  if (!req.files) return res.status(400).send("No files were uploaded.");
  let pic = req.body.firstName + ".jpg";

  req.files.studentPicture.mv(__dirname + "/assets/images/" + pic, err => {
    if (err) return res.status(500).send(err);
  });
  const student = req.body;

  student.src = pic;
  student.alt = req.body.firstName;
  student.skills = req.body.skills.split(",");
  MongoClient.connect(
    url,
    (err, db) => {
      if (err) {
        throw error;
      }
      const dbo = db.db(myDB);
      console.log(req.body);
      dbo.collection(myCollection).insertOne(req.body, (err, result) => {
        if (err) {
          throw error;
        }
        res.redirect("/");
        db.close();
      });
    }
  );
});

app.listen(3001);
console.log("3001 is the server");
