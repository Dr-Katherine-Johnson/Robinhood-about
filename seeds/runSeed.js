const { DATABASE } = require("../tempConfig.js"); //NEED TO CHANGE
const { save } = require(`./save-${ DATABASE }`);
const { save2 } = require(`./save-${ DATABASE }2`);


save();

module.exports.save2 = function () {
  save2();
};
