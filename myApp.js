var express = require("express");
var app = express();

console.log("Hello World");

app.use("/public", express.static(__dirname + "/public"));

// middleware to use dotenv in local testing
app.get("*", (req, res, next) => {
  if (req.ip === "::1") {
    require("dotenv").config();
  }
  next();
})

// middleware to log requests
app.get("*", (req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`)
  next();
});

// chain a middleware function and a final handler
app.get("/now", (req, res, next) => {
  req.time = new Date().toString();
  next();
}, (req, res) => {
  res.json({time: req.time})
})

app.get("/json", (req, res) => {
  res.json({
    message:
      process.env.MESSAGE_STYLE === "uppercase" ? "HELLO JSON" : "Hello json",
  });
});

app.get("/:word/echo", (req, res) => {
  res.json({echo: req.params.word});
})

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

module.exports = app;
