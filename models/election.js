var randomstring = require("randomstring");
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

var Election = function() {
};

Election.prototype.create = function(name, start, end, callback) {
  var id = randomstring.generate(6);
  var query = "INSERT INTO election (electionId, electionName, startDate, endDate)"
    + " VALUES ('" + id + "','" + name + "','" + start + "','" + end + "');";
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
        } else {
          callback(id);
        }
      });
    }
  });
};

Election.prototype.initializeResult = function(candidate) {
  var id = randomstring.generate(6);
  var query = "INSERT INTO election_result (electionResultId, candidateId, count)"
    + " VALUES ('" + id + "','" + candidate + "'," + 0 + ");";
  pool.getConnection(function (err, conn) {
    if (err) {
      return;
    } else if (conn) {
      conn.query(query, function (err, rows, fields) {
        conn.release();
        if (err) {
          console.log("Error with SQL query");
          console.log(err);
          return;
        }
      });
    }
  });
}

Election.prototype.getAll = function(callback) {
  var query = "SELECT * FROM election";

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
        } else {
          callback(rows);
        }
      });
    }
  });
};

module.exports = Election;
