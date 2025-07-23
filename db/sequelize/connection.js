let connection = null;
let sequelize = require("sequelize");
// let config = require("./../config/db");
let config = require("./../../config/config.json");
require('dotenv').config()

//--// 
sequelize.DataTypes.DATE.prototype._stringify = function _stringify(date, options) {
    date = this._applyTimezone(date, options);
    return date.format("YYYY-MM-DD HH:mm:ss");
};
//--//

if (!connection) { connection = new sequelize(config[process.env.NODE_ENV].name, config[process.env.NODE_ENV].user, config[process.env.NODE_ENV].pass, config[process.env.NODE_ENV]); }


//--//

module.exports = {
    config,
    sequelize,
    connection
};
