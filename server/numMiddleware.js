const { createTickers } = require("../seeds/tickerCreator.js");
// create a function that given an ID -> index
// gives you back a ticker from the tickers array with that index
module.exports = {
  convertIDtoTicker (req, res, next) {
    // first check if the ticker came as a string or number
    const isNumber = !isNaN(Number(req.params.ticker));
    // if the ticker came as a number we want to convert it
    if (isNumber) {
      // get the ticker form our array
      let ticker = tickerArray[Number(req.params.ticker)];
      // re-write the params
      req.params.ticker = ticker;
    }
    next();
  },
  generateTestTickers() {
    console.log('generating tickers for testing');
    // use our seeding function ticker generator
    const max = 1000000;
    const last10percent = Math.floor(max * .1);
    tickerArray = createTickers(max).slice(last10percent, max); // use your custom function
  }
}