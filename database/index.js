const mongoose = require("mongoose");
const config = require("../env.config.js");

mongoose.connect(
  `${config.DATABASE_URL}:${config.DATABASE_PORT}/${config.DATABASE_NAME}`,
  // "mongodb://database/robinhood",
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    autoIndex: false
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("db connected!");
  // db.db.listCollections().toArray(function(err, names) {
  //   if (err) {
  //     console.log(err);
  //     } else {
  //       for (i = 0; i < names.length; i++) {
  //         console.log(names[i].name);
  //         if ((names[i].name = "abouts")) {
  //           console.log("Abouts Collection Exists in DB");
  //           About.abouts.dropIndexes(
  //               function(err, result) {
  //                 console.log("Collection droped");
  //               }
  //           );
  //           console.log("Abouts Collection No Longer Available");
  //         } else {
  //             console.log("Collection doesn't exist");
  //         }
  //       }
  //     }
  // });
});

const aboutSchema = mongoose.Schema({
  ticker: { type: String, unique: true, required: true, index: true },
  about: String,
  CEO: String,
  open: String,
  high: String,
  low: String,
  marketCap: String,
  yearHigh: String,
  employees: Number,
  priceEarnings: Number,
  yearLow: String,
  headquarters: String,
  dividendYield: Number,
  founded: Number,
  averageVolume: String,
  volume: String
});

const About = mongoose.model("About", aboutSchema);

// Creates data about stock based on ticker
const postAbout = (queryString, callback) => {
  const newAbout = new About(queryString)
  newAbout.save()
    .then(result => {
      callback(null, result);
    })
    .catch(err => {
      console.log("err:", err);
    });
};

// Reads data about stock based on ticker
const getAbout = (queryString, callback) => {
  About.findOne({ ticker: queryString })
    .lean()
    .then(result => {
      callback(null, result);
    })
    .catch(err => {
      console.log("err:", err);
    });
};

// Updates about data for stock ticker
const putAbout = (queryString, callback) => {
  About.findOneAndUpdate({ ticker: queryString.params.ticker }, queryString.body, {new: true}, (err, result) => {
    if (err) {
      console.log("err:", err);
    }
    callback(null, result)
  })
};

// Deletes about data for stock ticker 
const deleteAbout = (queryString, callback) => {
  About.findOneAndDelete({ ticker: queryString })
    .lean()
    .then(result => {
      callback(null, result);
    })
    .catch(err => {
      console.log("err:", err);
    });
};

module.exports = { About, getAbout, mongoose };

module.exports = { About, postAbout, getAbout, putAbout, deleteAbout, mongoose };
