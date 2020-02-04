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


module.exports = { nFormatter, createPrices };
