const { DATABASE } = require("../tempConfig.js"); //NEED TO CHANGE
const { save } = require(`./save-${ DATABASE }`);

save();
