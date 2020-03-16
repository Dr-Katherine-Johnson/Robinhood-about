const { DATABASE } = require("../tempConfig.js"); //NEED TO CHANGE
middleware.generateTickers();

const routes = require(`./routes-${ DATABASE }`);

module.exports = app => {
  app.use('/about', routes);
}