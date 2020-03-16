const createTickers = (max) => {
  // returns the same array of 10M unique strings (tickers)
  // each ticker is 3 - 4 characters in length // TODO: vary the ticker length
  // each ticker is made up of the letters A - Z
  let seed = 1;
  let result = [];
  let ticker = [];

  // start at decimal 65
  let startValue = 65;
  let decimal = 65;
  let incrementor = 0;
  let letter = 0;

  var recursiveFunction = function(singleSolution) {
    if (singleSolution.length > 4) {
      result.push(singleSolution.join(''));
      return;
    }
    for (var i=0; i < 26; i++) {
      recursiveFunction(singleSolution.concat([String.fromCharCode(startValue + i)]));
      if (result.length > max) { 
        break;
      }
    }
  };
  recursiveFunction([]);
  return result;
};

let tickers = createTickers(10000000);

module.exports = { tickers, createTickers };
