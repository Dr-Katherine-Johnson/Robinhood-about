const { DATABASE } = require("../tempConfig.js"); //NEED TO CHANGE
const { save } = require(`./save-${ DATABASE }`);
const { save2 } = require(`./save-${ DATABASE }2`);

module.exports.save = function () {
  save();
};

module.exports.save2 = function () {
  save2();
};
