var dbConn = require('../util/DBConnection');
var codes = {};


exports.find = function(key, done) {
  var code = codes[key];
  dbConn.get(function(err, connection) {
	  if (err){
			console.log("Error occurred in authorizationcodes.js")
			return done('Database problem')
		}
	      
	    connection.query('SELECT * FROM oauth_authorization_codes WHERE authorization_code = ?',key, function (err, rows) {
	      if (err){
	    	  console.log("Error occurred in authorizationcodes.js find")
	    	  return done(err);
	      }
	      connection.release();
	      done(null, rows[0])
	    });
	  });
//  return done(null, code);
};

exports.save = function(code, clientID, redirectURI, userID, done) {
  codes[code] = { clientID: clientID, redirectURI: redirectURI, userID: userID };
  dbConn.get(function(err, connection) {
	  if (err){
			console.log("Error occurred in authorizationcodes.js")
			return done('Database problem')
		}
    
	    console.log(redirectURI);
  var values = [code , clientID, userID , redirectURI ];
  connection.query('INSERT INTO oauth_authorization_codes (authorization_code, client_id, user_id, redirect_uri) VALUES(?, ?, ?, ?)', values, function(err, result) {
    if (err){
    	console.log("Error occurred in authorizationcodes.js save")
    	return done(err)
    }
    connection.release();
    console.log("Auth code added");
    done(null)
  }); 
  });
};

exports.deleteAuthCode = function(key, done) {
    delete codes[key];
    dbConn.get(function(err, connection) {
    	if (err){
			console.log("Error occurred in authorizationcodes.js")
			return done('Database problem')
		}
	    
	  connection.query('DELETE FROM oauth_authorization_codes WHERE authorization_code = ?',key, function(err, result) {
		  if (err){
				console.log("Error occurred in authorizationcodes.js deleteAuthCode")
				return done(err)
			}
	    connection.release();
	    console.log("Auth code Deleted");
	    return done(null);
	  }); 
  });
    
}
