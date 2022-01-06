var express = require("express");
var bodyParser = require("body-parser");
const res = require("express/lib/response");
var app = express();

console.log("Hello World");

app.use("/public", express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));

// middleware to use dotenv in local testing
app.get("*", (req, res, next) => {
  if (req.ip === "::1") {
    require("dotenv").config();
  }
  next();
});

// middleware to log requests
app.get("*", (req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// chain a middleware function and a final handler
app.get(
  "/now",
  (req, res, next) => {
    req.time = new Date().toString();
    next();
  },
  (req, res) => {
    res.json({ time: req.time });
  }
);

// use env variable
app.get("/json", (req, res) => {
  res.json({
    message:
      process.env.MESSAGE_STYLE === "uppercase" ? "HELLO JSON" : "Hello json",
  });
});

// use route parameters
app.get("/:word/echo", (req, res) => {
  res.json({ echo: req.params.word });
});

// chain routes
// use query parameters
// handle POST
app
  .route("/name")
  .get((req, res) => {
    res.json({ name: `${req.query.first} ${req.query.last}` });
  })
  .post((req, res) => {
    console.log(req.body);
    res.json({ name: `${req.body.first} ${req.body.last}` });
  });
// (req, res, next) => {
//   console.log("test post");
//   next();
// },
// bodyParser,
// (req, res) => {
//   res.json({ name: `${req.body.first} ${req.body.last}`});
// });

app.post("/name2", (req, res) => res.send("post"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

module.exports = app;
