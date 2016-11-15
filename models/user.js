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

var User = function() {
};

User.prototype.validateUser = function(email, password, callback) {
  var query = "SELECT * FROM user WHERE Email = '" + email + "' AND " +
    " Password = '" + password + "'";

  pool.getConnection(function (err, conn) {
    if (err) {
      return callback(err, null);
    }
    else if (conn) {
      conn.query(query, function (err, rows, fields) {
        conn.release();
        if (err) {
          console.log("Error with SQL query");
          console.log(err);
          callback(false);
        }

        if (rows.length == 1) {
          callback(true);
        }
        else {
          callback(false);
        }
      });
    }
  });
 }

module.exports = User;
