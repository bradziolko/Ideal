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

var Zip = function() {
};

Zip.prototype.create = function(zipCode, electionId) {
  var query = "INSERT INTO zipcode (zipCode, electionId)"
    + " VALUES ('" + zipCode + "','" + electionId + "');";
  pool.getConnection(function (err, conn) {
    if (err) {
      return;
    } else if (conn) {
      conn.query(query, function (err, rows, fields) {
        conn.release();
        if (err) {
          console.log("Error with SQL query");
          console.log(err);
        }
      });
    }
  });
};

module.exports = Zip;
