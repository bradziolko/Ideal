var mysql = require("mysql");
var Config = require("../config");
var config = new Config();
var bcrypt = require('bcrypt');
var randomstring = require("randomstring");
var loggedIn = "";

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

User.prototype.getDetails = function(callback){
  var query = "SELECT electionId FROM `zipcode` WHERE zipCode = (SELECT zipCode FROM user_voter WHERE email = '" + global.loggedIn + "')"
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

User.prototype.getCurrentUser = function(user,callback) {
  global.loggedIn = user
  callback(global.loggedIn);
};

User.prototype.validateUser = function(email, password, callback) {
    var query = "SELECT * FROM user_voter WHERE email = '" + email + "'";
    
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
            bcrypt.compare(password, rows[0].password, function(err, res) {
              if (res == true) {
                callback(rows[0].verified);
              }
            });
          }
          else {
            callback(-1);
          }
        });
      };
    });
};

User.prototype.validateAdmin = function(email, password, callback) {
 // console.log ("Admin login function call")
    var query = "SELECT * FROM user_admin WHERE email = '" + email + "'";
    
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
            console.log(rows[0].password)
            if (rows[0].password == password){
              callback(1)  
            }
            else{
              callback(0)  
            }
          }
          else {
            callback(-1);
          }
        });
      };
    });
};

User.prototype.validateManager = function(email, password, callback) {
//  console.log ("Manager login function call")
//  console.log("branch change push")
    var query = "SELECT * FROM user_manager WHERE email = '" + email + "'";
    
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
            console.log(rows[0].password)
            if (rows[0].password == password){
              callback(1)  
            }
            else{
              callback(0)  
            }
          }
          else {
            callback(-1);
          }
        });
      };
    });
};
User.prototype.createCandidate = function (user, callback) {
  var candidateId = randomstring.generate(6)
  var adminId = "admin1@idealrealconfirmation.com"
  var electionId = "1"
  var picture = "abc"
  var gen = "Male"
  if (user.gender == 1){
    gen = "Male"
  }
  if (user.gender == 0){
    gen = "Female"
  }
  var query = "INSERT INTO `candidate` (" +
  "`firstName`, `lastName`, `picture`, `dob`, `gender`, `candidateId`, `bio`) " +
  "VALUES ('" +
  user.firstName + "', '" +
  user.lastName + "', '" +
  picture + "', '" +
  user.dob + "', '" +
  gen + "', '" +
  candidateId + "', '" +
  user.bio + "')";
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

User.prototype.registerUser = function(user, verificationNumber, callback) {
  
  bcrypt.hash(user.password, saltRounds, function(err, hash) {
    
    
    var voterId = randomstring.generate(6)
      
    var query = "INSERT INTO `user_voter`(" +
      "`Firstname`, `Lastname`, `EmailVerificationNumber`, " + 
      "`email`, `password`, `idType1`, " +
      "`addressLine1`, `addressLine2`, `city`, " +
      "`state`, `zipCode`,`voterId`,`personalId1`,`idType2`,`personalId2`) " +
      "VALUES ('" + 
      user.firstname + "', '" + 
      user.lastname + "', '" +
      verificationNumber + "', '" +
      user.email + "', '" +
      hash + "', '" +
      user.idtype1 + "', '" +
      user.address1 + "', '" +
      user.address2 + "', '" +
      user.city + "', '" +
      user.state + "', '" +
      user.zip + "', '" + voterId + "', '" + user.personalid1 + "', '" + user.idtype2 + "', '" + user.personalid2 + "')";
      
      
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
  var query = "SELECT * FROM user_voter WHERE email = '" + email + "' AND " +
    " EmailVerificationNumber = '" + verificationNumber + "'";

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
  var query = "UPDATE user_voter " +
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
