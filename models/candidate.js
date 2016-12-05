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

var Candidate = function() {
};

Candidate.prototype.getAll = function(callback) {
  var query = "SELECT firstName, lastName, candidateId FROM candidate "
    + "WHERE electionId IS NULL";
  pool.getConnection(function (err, conn) {
    if (err) {
      return callback(-1);
    } else if (conn) {
      conn.query(query, function (err, rows, fields) {
        conn.release();
        if (err) {
          console.log("Error with SQL query");
          console.log(err);
          callback(-1);
        }
        
        callback(rows);
      });
    }
  });
};

Candidate.prototype.setElection = function(candidateId, electionId) {
  var query = "UPDATE candidate "
    + "SET electionId='" + electionId + "' "
    + "WHERE candidateId='" + candidateId + "';";
  console.log(query);

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

module.exports = Candidate;
