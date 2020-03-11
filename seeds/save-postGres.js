const { pgp, db } = require("../database/index-postGres.js");
const { tickers } = require("./tickerCreator.js");
const { nFormatter, createPrices } = require('./numCreator.js');
const faker = require("faker");

//set of columns, template
const cs = new pgp.helpers.ColumnSet(['ticker', 'about', 'CEO', 'open', 'high', 'low', 'marketCap', 'employees', 'priceEarnings', 'yearHigh', 'yearLow', 'headquarters', 'dividendYield', 
  'founded', 'averageVolume', 'volume'], {table: 'abouts'});

// data input values: array of objects [{col_a: 'a1', col_b: 'b1'}, {col_a: 'a2', col_b: 'b2'}]
var values = [];

// cycle through ticker array and create data for each item
const createCollection = async () => {
  for (let i = 0; i < tickers.length; i++) {
    if (values === 0) { values = []};
    let prices = createPrices();
    var stock = {
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
    };
    await values.push(stock);

    // every 1000 items, insert into the database
    const isLastItem = i === tickers.length - 1;
    if (i % 500 === 0 || isLastItem) {

      // generating a multi-row insert query:
      var query = pgp.helpers.insert(values, cs);
      //=> INSERT INTO "tmp"("col_a","col_b") VALUES('a1','b1'),('a2','b2')

      // executing the query:
      await db.none(query)
        .then(data => {
          console.log('SUCCESS: ', i)
          return new Promise((resolve, reject) => { 
            if (i % 10000 === 0) {
              setTimeout(function(){ resolve(values = 0) }, 5000);
            } else {
              resolve(values = 0);
            }
          })
        })
        .catch(error => {
            console.log('ERROR ', i, ': ', error);
        });
    }
  }
  
  return await('collection seeded');
}

const save = () => {
  console.log('LENGTH: ', tickers.length)
  // Start up database and table
  db.none('DROP TABLE IF EXISTS $1:name', 'abouts')
    .then(() => {
      console.log('Creating table');
      db.none('CREATE TABLE "abouts"("id" SERIAL PRIMARY KEY, "ticker" VARCHAR (50) UNIQUE NOT NULL, "about" TEXT, "CEO" VARCHAR (200), "open" VARCHAR (50), "high" VARCHAR (50), "low" VARCHAR (50), "marketCap" VARCHAR (50), "yearLow" VARCHAR (50), "yearHigh" VARCHAR (50), "employees" INT, "priceEarnings" REAL, "headquarters" VARCHAR (200), "dividendYield" REAL, "founded" INT, "averageVolume" VARCHAR (50), "volume" VARCHAR (50))')
      .then(() => {
        console.log('Connected to PostGres')
        db.none('TRUNCATE TABLE "abouts"')
        .then(() => {
          createCollection()
          .then((value) => {
            console.log(value);
            console.log("db closed!");
          })
        })
      })
    })
    .catch(error => {
      console.log(error)
    })
  return;
}

module.exports = { save };

