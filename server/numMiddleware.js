module.exports = {
  colLookup (ticker) {
    // first check if the ticker came as a string or number
    const isNumber = !isNaN(Number(ticker));
    // if the ticker came as a number we want to add to the id column
    if (isNumber) {
      return 'id'
    } else {
      return 'ticker'
    }
  }
}