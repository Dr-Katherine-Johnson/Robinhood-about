const { postAbout, getAbout, putAbout, deleteAbout } = require("../database/index.js"); // database
var express = require('express')
var router = express.Router()

// Create - need to create postabout
router.post('/', (req, res) => {
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
router.get("/:ticker", (req, res) => {
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
router.put('/:ticker', function (req, res) {
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
router.delete('/:ticker', function (req, res) {
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

module.exports = router