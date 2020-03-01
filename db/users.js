var dbConn = require('../util/DBConnection');
var users = [
    { id: '1', username: 'bob', password: 'secret', name: 'Bob Smith' },
    { id: '2', username: 'joe', password: 'password', name: 'Joe Davis' }
];


exports.find = function(id, done) {
  /*for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.id === id) {
      return done(null, user);
    }
  }
  return done(null, null);*/
	dbConn.get(function(err, connection) {
	    if (err){
	    	console.log("Error occurred in users.js")
	    	return done('Database problem')
	    }
	    connection.query('SELECT * FROM users WHERE id = ?',id, function (err, rows) {
	      if (err){
	    	  console.log("Error occurred in clients.js find")
	    	  return done(err)
	      }
	      connection.release();
	      done(null, rows[0])
	    });
	  });
};

exports.findByUsername = function(username, done) {
/*  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return done(null, user);
    }
  }
  return done(null, null);*/
	dbConn.get(function(err, connection) {
	    if (err) return done('Database problem')
	      
	    connection.query('SELECT * FROM users WHERE  email = ?',username, function (err, rows) {
	      if (err){
	    	  console.log("Error occurred in clients.js findByUsername")
	    	  return done(err);
	      }
	      connection.release();
	      done(null, rows[0])
	    });
	  });
};

exports.loginCheck = function(username,password, done) {
	/*  for (var i = 0, len = users.length; i < len; i++) {
	    var user = users[i];
	    if (user.username === username) {
	      return done(null, user);
	    }
	  }
	  return done(null, null);*/
		dbConn.get(function(err, connection) {
		    if (err){
		    	console.log("Error occurred in clients.js")
		    	return done('Database problem')
		    }
		      
		    connection.query('SELECT * FROM users WHERE  email = ?,password=?',username,password, function (err, rows) {
		      if (err){
		    	  console.log("Error occurred in clients.js loginCheck")
		    	  return done(err);
		      }
		      connection.release();
		      if(rows.length > 0)
		    	  done(null, rows[0])
		      else
		    	  done("Invalid Login");
		    });
		  });
	};
