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

Candidate.prototype.updateCount = function(candidateId){
  var query = "UPDATE candidate SET count = count + 1 WHERE candidateId = '" + candidateId + "'";
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
          return;
        }
      });
    }
  });
};
Candidate.prototype.getCandidatesFromElection = function(electionId, i, callback) {
  var query = "SELECT * FROM candidate WHERE electionId = '" + electionId + "';";
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
          return;
        } else {
          callback(rows, i);
        }
      });
    }
  });
};

Candidate.prototype.getCandidateDetails = function(i,user,callback) {
  var query = "SELECT firstName, lastName, candidateId, bio FROM candidate WHERE electionId = '" + user + "' ";
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
        callback(i,rows);
      });
    }
  });
};

Candidate.prototype.getAll = function(callback) {
  var query = "SELECT firstName, lastName, candidateId FROM candidate";
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

module.exports = Candidate;
