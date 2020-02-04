const { tickers } = require("./tickerCreator.js");
const { About, mongoose } = require("../database/index.js");
const faker = require("faker");

// formats numbers to be abbreviated with letter notation: '20M'
const nFormatter = num => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "T";
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num;
};

//returns array of prices for year low, low, open, high, and year high
const createPrices = () => {
  let priceArr = [];
  priceArr.push(parseFloat((Math.random() * (100 - 1 + 1) + 1).toFixed(2)));
  for (let i = 0; i < 4; i++) {
    let newNum = parseFloat(priceArr[i] * 0.1);
    newNum += priceArr[i];
    priceArr.push(newNum);
  }
  priceArr = priceArr.map(num => {
    num = num.toFixed(2);
    return `$${num}`;
  });
  return priceArr;
};

// cycle through ticker array and create data for each item
const createCollection = async () => {
  let collArr = [];

  for (let i = 0; i < 100000; i++) { //tickers.length
    let prices = createPrices();
    const stock = new About({
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
    });
    collArr.push(stock);

    // every 1000 items, insert into the database
    const isLastItem = i === tickers.length - 1;
    if (i % 200 === 0 || isLastItem) {
      await About.insertMany(collArr, (err, result) => {
        if (err) {
          console.log('ERROR ', i, ': ', err);
        } else if (result) {
          return new Promise((resolve, reject) => { resolve(collArr = 0)})
        }
      })
    }
  }
  return await('collection seeded');
};

const save = async () => {
  console.log('LENGTH: ', tickers.length)
  //clear db before run
  await About.deleteMany({}, err => {
    if (err) {
      console.log("err clearing db before seeding: ", err);
    } else {
      console.log("db cleared before seeding");
    }
  });

  createCollection().then((value) => {
    console.log(value);
    mongoose.connection.close();
    console.log("db closed!");
  });
  return;
}
module.exports = { save };
