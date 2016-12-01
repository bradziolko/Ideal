var mysql = require("mysql");
var Config = require("../config");
var config = new Config();
var bcrypt = require('bcrypt');

var dbConfig = config.sql();
var pool = mysql.createPool({
  host: dbConfig.host,
  database: dbConfig.database,
  user: dbConfig.user,
  password: dbConfig.password
});

var User = function() {
};

const saltRounds = 10;

User.prototype.validateUser = function(email, password, callback) {
  
  bcrypt.hash(password, saltRounds, function(err, hash) {
    var query = "SELECT * FROM user WHERE email = '" + email + "' AND " +
    " password = '" + hash + "'";

    pool.getConnection(function (err, conn) {
      if (err) {
        return callback(-1);
      }
      else if (conn) {
        conn.query(query, function (err, rows, fields) {
          conn.release();
          if (err) {
            console.log("Error with SQL query");
            console.log(err);
            callback(-1);
          }

          if (rows.length == 1) {
            callback(rows[0].verified);
          }
          else {
            callback(-1);
          }
        });
      }
    });
  });
};

User.prototype.registerUser = function(user, verificationNumber, callback) {
  
  bcrypt.hash(user.password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    
    /*
    var query = "INSERT INTO user (email, password, verificationNumber)" +
      "VALUES ('" + user.email + "', '" + hash + "', '" + verificationNumber + "')";
      */
      
    var query = "INSERT INTO user_voter (" +
      "Firstname, Lastname, " + 
      "email, password, idType1, " +
      "addressLine1, addressLine2, city, " +
      "state, zipCode) " +
      "VALUES (" + 
      user.firstname + "," + 
      user.lastname + "," +
      user.email + "," +
      hash + "," +
      user.idtype1 + "," +
      user.address1 + "," +
      user.address2 + "," +
      user.city + "," +
      user.state + "," +
      user.zip + "," +;
      
      
    pool.getConnection(function (err, conn) {
      if (err) {
        return callback(false);
      }
      else if (conn) {
        conn.query(query, function (err, rows, fields) {
          conn.release();
          if (err) {
            console.log("Error with SQL query");
            console.log(err);
            callback(false);
          }
          
            callback(true);
        });
      }
    });
  });
};

User.prototype.verifyEmail = function(email, verificationNumber, callback) {
  var query = "SELECT * FROM user WHERE email = '" + email + "' AND " +
    " verificationNumber = '" + verificationNumber + "'";

  pool.getConnection(function (err, conn) {
    if (err) {
      return callback(false);
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
};

User.prototype.setVerified = function(email, callback) {
  var query = "UPDATE user " +
    "SET verified = 1 " +
    "WHERE email = '" + email + "'";

  pool.getConnection(function (err, conn) {
    if (err) {
      return callback(false);
    }
    else if (conn) {
      conn.query(query, function (err, rows, fields) {
        conn.release();
        if (err) {
          console.log("Error with SQL query");
          console.log(err);
          callback(false);
        }
        
          callback(true);
      });
    }
  });
};

module.exports = User;
