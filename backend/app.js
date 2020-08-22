const app = require("express")();
const mongo = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
let db;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Handling CORS policy
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

const errorHandler = err => {
  if (err) console.log(err);
};

// Connect to DataBase
const getConnection = (() => {
  const url = "mongodb://localhost/sample";

  mongo.connect(url, { useUnifiedTopology: true }, (err, result) => {
    errorHandler(err);
    db = result.db("sample");
  });
})();

// Get all employees
app.get("/employees", (req, res) => {
  if (db == undefined) res.send("Data not available right now!");

  db.collection("employees")
    .find()
    .toArray((e, r) => {
      errorHandler(e);
      res.send(r);
    });
});

// Add new employee
app.post("/employees", (req, res) => {
  if (db == undefined) res.send("Data not available right now!");
  let data = req.body;
  db.collection("employees")
    .find()
    .count()
    .then(count => {
      data.empId = count + 1;
      db.collection("employees").insertOne(data);
      res.send("Employee added to the db: " + JSON.stringify(data));
    })
    .catch(err => errorHandler(err));
});

// Get an employee
app.get("/employees/:Id", (req, res) => {
  if (db == undefined) res.send("Data not available right now!");
  const empId = parseInt(req.params.Id);

  db.collection("employees")
    .find({ empId: empId })
    .toArray((e, r) => {
      errorHandler(e);
      res.send(r);
    });
});

// Update an employee
app.put("/employees/:Id", (req, res) => {
  if (db == undefined) res.send("Data not available right now!");
  const Id = parseInt(req.params.Id);
  const { empName, empCity } = req.body;
  db.collection("employees").updateOne(
    { empId: Id },
    {
      $set: { empName: empName, empCity: empCity },
    }
  );

  res.send("Employee updated: " + JSON.stringify(req.body));
});

// Delete an employee
app.delete("/employees/:Id", (req, res) => {
  if (db == undefined) res.send("Data not available right now!");
  const Id = parseInt(req.params.Id);
  const deleted = db.collection("employees").deleteOne({ empId: Id });
  res.send("Employee deleted successfully!: empId: " + Id);
});

// Server Listening
app.listen(2020, () => console.log("The server is listening at port: " + 2020));
