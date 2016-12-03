var mysql = require("mysql");
var Config = require("../config");
var config = new Config();
var dbConfig = config.sql();
var pool = mysql.createPool({
  host: dbConfig.host,
  database: dbConfig.database,
  user: dbConfig.user,
  password: dbConfig.password
});

var Admin = function() {
};

Admin.prototype.something = function(){
    console.log("Button press working")
};

module.exports = Admin;