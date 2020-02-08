const db = require("../database/index-postGres.js");
const { tickers } = require("./tickerCreator.js");
const { nFormatter, createPrices } = require('./numCreator.js');
const faker = require("faker");

// cycle through ticker array and create data for each item
const createCollection = async () => {
  let collArr = [];
  let batchSize = 2;

  // Set up field variables
  let headers = ['ticker', 'about', 'CEO', 'open', 'high', 'low', 'marketCap', 'employees', 'priceEarnings', 'yearHigh', 'yearLow', 'headquarters', 'dividendYield', 
    'founded', 'averageVolume', 'volume'];
  let fields = {};
  headers.forEach((e) => fields[e] = new Array(0));

  // Set up dynamic query
  const setQuery = async (indexArg) => {
    let queryTop = 'INSERT INTO "abouts" (';
    let queryBottom = ') VALUES (';
    for (let j = 1; j <= (fields[headers[indexArg]].length) ; j++){
      if (j === (fields[headers[indexArg]].length)) {
        queryBottom = queryBottom + '$' + j.toString() + ')';
      } else {
        queryBottom = queryBottom + '$' + j.toString() + ', ';
      }
    }
    return (queryTop + await headers[indexArg] + queryBottom);
  }

  for (let i = 0; i < 10; i++) { //tickers.length
    const prices = createPrices();
    const p1 = Promise.resolve(fields.ticker.push(tickers[i])); 
    // const pTemp = Promise.resolve(console.log('ticker promise', fields.ticker));
    const p2 = Promise.resolve(fields.about.push(faker.lorem.paragraph((sentence_count = 10))));
    const p3 = Promise.resolve(fields.CEO.push(faker.name.findName()));
    const p4 = Promise.resolve(fields.open.push(prices[2]));
    const p5 = Promise.resolve(fields.high.push(prices[3]));
    const p6 = Promise.resolve(fields.low.push(prices[1]));
    const p7 = Promise.resolve(fields.marketCap.push(nFormatter(
      faker.random.number({ min: 1000000000, max: 2500000000 })
    )));
    const p8 = Promise.resolve(fields.volume.push(nFormatter(faker.random.number({ min: 10000000, max: 30000000 }))));
    const p9 = Promise.resolve(fields.employees.push(faker.random.number({ min: 5000, max: 200000 })));
    const p10 = Promise.resolve(fields.priceEarnings.push((Math.random() * (100 - 1 + 1) + 1).toFixed(2)));
    const p11 = Promise.resolve(fields.yearHigh.push(prices[4]));
    const p12 = Promise.resolve(fields.yearLow.push(prices[0]));
    const p13 = Promise.resolve(fields.headquarters.push(`${faker.address.city()}, ${faker.address.state()}`));
    const p14 = Promise.resolve(fields.dividendYield.push((Math.random() * (10 - 1 + 1) + 1).toFixed(2)));
    const p15 = Promise.resolve(fields.founded.push(faker.random.number({ min: 1950, max: 2019 })));
    const p16 = Promise.resolve(fields.averageVolume.push(nFormatter(
      faker.random.number({ min: 10000000, max: 30000000 })
    )));

    // Insertion function
    const insertBatch = async (j) => {
      // console.log('calling batch', j, fields.ticker.length)
      const isLastItem = j === tickers.length - 1;
      if ((j % batchSize === 0 || isLastItem) && j !== 0) {
        for (let index = 0; index < headers.length; index ++) {            
          let pQuery = await setQuery(index);
          let pParam = Promise.resolve(fields[headers[index]]);
          await Promise.all([pQuery, pParam])
          .then(async ([qur, param]) => {
            await console.log ('fields BEFORE', i, param.length);
            await db.query(qur, param, (err, res) => { 
              if (err) {
                // console.log ('fields AFTER', i, param.length); // length is normal
                // console.log('ticker', fields[headers[index]].length);
                // console.log(j, "FAILED: ", setQuery(index), 'field', fields[headers[index]]);
                // let qur = setQuery(index);
                // console.log(i, "FAILED: ", qur, param, param.length)
                console.log(i, "FAILED: ", err)
                // return;
              } else {
                console.log(i, "SUCCESS: ", res)
                fields[headers[index]] = new Array(0);
              }
            })
          })

        }
      }
    } 
    

    // Chaining promises
    await Promise.all([ p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16])
    .then(async function(values) {
      // console.log
      await insertBatch(i);
    })
  }

    // every 1000 items, insert into the database
    //   Promise.all([
    //     await db.query('INSERT INTO abouts(ticker) VALUES $1', ticker),
    //     await db.query('INSERT INTO abouts(about) VALUES $1', about),
    //     await db.query('INSERT INTO abouts(CEO) VALUES $1', CEO),
    //     await db.query('INSERT INTO abouts(open) VALUES $1', open),
    //     await db.query('INSERT INTO abouts(high) VALUES $1', high),
    //     await db.query('INSERT INTO abouts(low) VALUES $1', low),
    //     await db.query('INSERT INTO abouts(marketCap) VALUES $1', marketCap),
    //     await db.query('INSERT INTO abouts(employees) VALUES $1', employees),
    //     await db.query('INSERT INTO abouts(priceEarnings) VALUES $1', priceEarnings),
    //     await db.query('INSERT INTO abouts(yearHigh) VALUES $1', yearHigh),
    //     await db.query('INSERT INTO abouts(yearLow) VALUES $1', yearLow),
    //     await db.query('INSERT INTO abouts(headquarters) VALUES $1', headquarters),
    //     await db.query('INSERT INTO abouts(dividendYield) VALUES $1', dividendYield),
    //     await db.query('INSERT INTO abouts(founded) VALUES $1', founded),
    //     await db.query('INSERT INTO abouts(averageVolume) VALUES $1', averageVolume),
    //     await db.query('INSERT INTO abouts(volume) VALUES $1', volume)
    //   ])
    //   .then(function(result) {
    // //     return new Promise((resolve, reject) => { resolve(
    //       ticker = about = CEO = open = high = low = marketCap = employees = priceEarnings = yearHigh = yearLow = headquarters = dividendYield = 
    // founded = averageVolume = volume = 0
    //     )})
    //   })
    //   .catch(err => { 
    //       console.log('ERROR ', i, ': ', err);
    //   });
    // }
  
  return await('collection seeded');
};

const save = async () => {
  console.log('LENGTH: ', tickers.length)
  var prep = await new Promise((resolve, reject) => { resolve(db.prep())});
  db.query('TRUNCATE "abouts"', (err, res) => {
    if (err) {
      console.log("err clearing db before seeding: ", err);
    } else {
      console.log("db cleared before seeding");
      createCollection()
      .then((value) => {
          console.log(value);
          // db.getClient.end()
          console.log("db closed!");
        });
    }
  })
    
  //clear db before run
  
  //close connection
  return;
}

module.exports = { save };