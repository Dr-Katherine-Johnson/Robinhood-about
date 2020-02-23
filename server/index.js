require('newrelic');
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
var path = require("path");
var expressStaticGzip = require("express-static-gzip");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Environment variables 
const config = require("../env.config.js");
const mountRoutes = require('../controller/index.js');

//Client files
app.use(expressStaticGzip(path.join(__dirname, "/../client/dist")));
app.use(express.static(__dirname + "/../client/dist"));

//Routing files
mountRoutes(app);
app.get("/", (req, res) => {
  res.send("hello world");
});

const port = config.PORT;

let server = app.listen(port, function() {
  console.log(`listening on port ${port}`);
});

module.exports = { app, server };
