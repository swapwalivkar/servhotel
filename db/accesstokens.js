var dbConn = require('../util/DBConnection');
var tokens = {};

exports.find = function(key, done) {
	var token = tokens[key];
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error Occurred In accesstokens.js Database problem");
			return done('Database problem');
		}
			

		connection.query('SELECT * FROM oauth_access_tokens WHERE access_token = ?',key, function(err, rows) {
				if (err){
					console.log("Error Occurred In accesstokens.js find");
					return done(err);
				}
				connection.release();
				if(rows.length > 0){
					done(null, rows[0])
				}
				else{
					var error = { message: 'Token expired' };
		            done(error);
				}
					
			});
	});
};

exports.save = function(token, userID, clientID, done) {
	tokens[token] = {
		userID : userID,
		clientID : clientID
	};
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error Occurred In accesstokens.js Database problem");
			return done('Database problem');
		}
		var values = [ token, clientID, userID, Date.now() ]
		connection.query(
			'INSERT INTO oauth_access_tokens (access_token, client_id, user_id, created) VALUES(?, ?, ?, ?)',
			values, function(err, result) {
				if(err){
					console.log("Error Occurred In accesstokens.js save");
					return done(err)
				}
				connection.release();	
				console.log("Token Added");
				done(null);
			});
	});
};

exports.deleteToken = function(token, done) {
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error Occurred In accesstokens.js Database problem");
			return done('Database problem');
		}
		console.log("In Delete Token:");
		connection.query('DELETE FROM oauth_access_tokens WHERE access_token = ?',token, function(err, result) {
			if (err){
				
				console.log("Error occurred in accesstokens.js deleteToken")
				return done(err)
			}
			connection.release();
			console.log("Token Deleted");
			done(null);
		});
	});
};

exports.updateExpiry = function(token, done) {
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error Occurred In accesstokens.js Database problem");
			return done('Database problem');
		}
		connection.query(
			'UPDATE oauth_access_tokens SET created = '+Date.now()+' WHERE access_token = ?',
			token, function(err, result) {
				if (err){
					console.log("Error occurred in accesstokens.js updateExpiry")
					return done(err)
				}
				connection.release();	
				console.log("Token Updated");
				done(null);
			});
	});
};