const { DATABASE } = require("../tempConfig.js"); //NEED TO CHANGE
const middleware = require('../server/numMiddleware.js');

middleware.generateTestTickers();

const routes = require(`./routes-${ DATABASE }`);

module.exports = app => {
  app.use('/about', routes);
}