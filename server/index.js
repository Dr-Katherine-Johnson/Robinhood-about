const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { postAbout, getAbout, putAbout, deleteAbout, } = require("../database/index.js");
// const { getAbout } = require("../database/index.js"); 

const config = require("../env.config.js");
const cors = require("cors");
var path = require("path");
var expressStaticGzip = require("express-static-gzip");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(expressStaticGzip(path.join(__dirname, "/../client/dist")));
app.use(express.static(__dirname + "/../client/dist"));

app.get("/", (req, res) => {
  res.send("hello world");
});

// Create - need to create postabout
app.post('/about', (req, res) => {
  let queryString = req.body;
  postAbout(queryString,(err, result) => {
    if (err) {
      res.status(400).json(`Error: ${err}`);
    } else {
      console.log("Created:", result);
      res.status(201).json(result);
    }
  });
})

// Read
app.get("/about/:ticker", (req, res) => {
  // console.log('req.params', req.params);
  let queryString = req.params.ticker;
  console.log("queryString", queryString);
  getAbout(queryString, (err, result) => {
    if (err) {
      res.status(400).json(`Error: ${err}`);
    } else {
      console.log("Read:", result);
      res.status(200).json(result);
    }
  });
});

// Update
app.put('/about/:ticker', function (req, res) {
  let queryString = req;
  putAbout(queryString,(err, result) => {
    if (err) {
      res.status(400).json(`Error: ${err}`);
    } else {
      console.log("Updated:", result);
      res.status(200).json(result);
    }
  });
})

// Delete
app.delete('/about/:ticker', function (req, res) {
  let queryString = req.params.ticker;
  deleteAbout(queryString,(err, result) => {
    if (err) {
      res.status(400).json(`Error: ${err}`);
    } else {
      console.log("Deleted:", result);
      res.status(200).json(result);
    }
  });
})

const port = config.PORT;

let server = app.listen(port, function() {
  console.log(`listening on port ${port}`);
});

module.exports = { app, server };
