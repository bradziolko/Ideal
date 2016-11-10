var mysql = require('mysql');
var connection = mysql.createConnection({
  host: "localhost",
  database: "ideal",
  user: "client",
  password: "client"
});

connection.connect(function(err) {
  if (err !== null) {
    console.log("Couldn't connect to server.");
    console.log(err);
  }
});
  

var User = function() {
};

User.prototype.validateUser = function(email, password) {
  var query = "SELECT * FROM user WHERE Email = '" + email + "' AND +
    " Password = '" + password + "'";
  
  getResult(query, function (err, rows) {
    if (!err) {
      return rows;
    }
    else {
      console.log(err);
    }
  });

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
  connection.getConnection(function (err, conn) {
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
