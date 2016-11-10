var mysql = require('mysql');
//var connection = mysql.createConnection({
var pool = mysql.createPool({
  host: "localhost",
  database: "ideal",
  user: "client",
  password: "client"
});

var User = function() {
};

User.prototype.validateUser = function(email, password, callback) {
  var query = "SELECT * FROM user WHERE Email = '" + email + "' AND " +
    " Password = '" + password + "'";
  
  getResult(query, function (err, rows) {
    if (!err) {
      console.log("butts");
      callback(rows);
    }
    else {
      console.log(err);
    }
  });
  console.log("END OF VALIDATE USER");
}

function getResult(query, callback) {
  executeQuery(query, function (err, rows) {
    if (!err) {
      callback(null, rows);
    }
    else {
      callback(true, err);
    }
  });
}

function executeQuery(query, callback) {
  pool.getConnection(function (err, conn) {
    if (err) {
      return callback(err, null);
    }
    else if (conn) {
      conn.query(query, function (err, rows, fields) {
        conn.release();
        if (err) {
          return callback(err, null);
        }
        
        return callback(null, rows);
      })
    }
    else {
      return callback(true, "No Connection");
    }
  });
}

module.exports = User;
