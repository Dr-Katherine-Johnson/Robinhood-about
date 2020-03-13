const { pgp, db } = require("../database/index-postGres.js");
const { tickers } = require("./tickerCreator.js");
const { nFormatter, createPrices } = require('./numCreator.js');
const faker = require("faker");
const fs = require('fs');
const path = require('path');
const csvWriter = require('csv-write-stream')

//CSV file paths
var csvFilename = "./seeds/seeds_data.csv";
var absPath = path.resolve(csvFilename);
var interval = 200000;

// cycle through ticker array and create data for each item
const createCollection = async (writer, encoding, start, cb) => {
  console.log('PATH:', absPath);

  //Iterator
  let i = start + interval;
  let id = start;

  let write = async () => {
    let ok = true;
    do {
      i -= 1;
      id += 1;

      //create data
      var prices = createPrices();
      var stock = await {
        ticker: tickers[i],
        about: faker.lorem.paragraph((sentence_count = 10)),
        CEO: faker.name.findName(),
        open: prices[2],
        high: prices[3],
        low: prices[1],
        marketCap: nFormatter(
          faker.random.number({ min: 1000000000, max: 2500000000 })
        ),
        employees: faker.random.number({ min: 5000, max: 200000 }),
        priceEarnings: (Math.random() * (100 - 1 + 1) + 1).toFixed(2),
        yearHigh: prices[4],
        yearLow: prices[0],
        headquarters: `${faker.address.city()}, ${faker.address.state()}`,
        dividendYield: (Math.random() * (10 - 1 + 1) + 1).toFixed(2),
        founded: faker.random.number({ min: 1950, max: 2019 }),
        averageVolume: nFormatter(
          faker.random.number({ min: 10000000, max: 30000000 })
        ),
        volume: nFormatter(faker.random.number({ min: 10000000, max: 30000000 }))
      }

      if (i === start) {
        console.log('END', id, 'START:', start)
        await writer.write(stock, encoding, cb);      
      } else {
        console.log(stock.ticker, 'ID: ', id, ' START: ', start)
        ok = await writer.write(stock);
      }
    } while (i > start && ok);
    if (i > start) {
    // had to stop early!
    // write some more once it drains
      await console.log('STOPPED')
      await writer.once('drain', write);
    }
  }
  await write()
}
 
const recurCB = async (start) => {
  fs.open(csvFilename, 'w', (err, fd) => {
    if (fd) {
      var writer = csvWriter({ headers: ['ticker', 'about', 'CEO', 'open', 'high', 'low', 'marketCap', 'yearLow', 'yearHigh', 'employees', 'priceEarnings', 'headquarters', 'dividendYield', 'founded', 'averageVolume', 'volume']});
      writer.pipe(fs.createWriteStream(csvFilename, {flags: 'a'}));
      createCollection(writer, 'utf-8', start, () => {
        writer.end();
        db.none("COPY abouts FROM $1 WITH (format csv, header)", absPath)
        .then(() => {
          console.log('SUCCESSFULLY COPIED INTO POSTGRES')
          fs.unlink(csvFilename, (err) => {
            if (err) throw err;
            if ((start + interval + interval) < tickers.length) {
              setTimeout(function(){ recurCB(start + interval)}, 20000);
            } else {
              console.log('SEEDING COMPLETE')
            } 
          });
        })
        .catch(error => {
            console.log('ERROR: ', error);
        });
      })       
    } else if (err) {
      console.log('CANT OPEN FILE: ', err)
    }
  })
}


const save2 = () => {
  console.log('LENGTH: ', tickers.length)
  // Start up database and table
  db.none('DROP TABLE IF EXISTS $1:name', 'abouts')
    .then(() => {
      console.log('Creating table');
      db.none('CREATE TABLE "abouts"("ticker" VARCHAR (50) UNIQUE NOT NULL, "about" TEXT, "CEO" VARCHAR (200), "open" VARCHAR (50), "high" VARCHAR (50), "low" VARCHAR (50), "marketCap" VARCHAR (50), "yearLow" VARCHAR (50), "yearHigh" VARCHAR (50), "employees" INT, "priceEarnings" REAL, "headquarters" VARCHAR (200), "dividendYield" REAL, "founded" INT, "averageVolume" VARCHAR (50), "volume" VARCHAR (50))')
      .then(() => {
        console.log('Connected to PostGres')
        db.none('TRUNCATE TABLE "abouts"') 
        .then(() => {
          // If CSV file exists, delete it and recreate with headers
          recurCB(0)
          });            
        })
      })
    .catch(error => {
      console.log(error)
    })
  return;
}

module.exports = { save2 };

