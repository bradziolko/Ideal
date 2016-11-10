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

User.prototype.getUser = function(email, password) {
  var auth = false;
  var query = connection.query("SELECT * FROM user WHERE Email = '" + email + "' AND" +
    " Password = '" + password + "'", function(err, result) {
      console.log(result);
      console.log(result.length);
      if (result.length == 1) {
        return true;
      }
      else {
        return false;
      }
  });
}

module.exports = User;
