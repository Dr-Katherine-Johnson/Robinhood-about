const { About, mongoose } = require("../database/index.js");
const { tickers } = require("./tickerCreator.js");
const { nFormatter, createPrices } = require('./numCreator.js');
const faker = require("faker");