var dbConn = require('../util/DBConnection');
var clients = [
    { id: '1', name: 'Samplr', clientId: 'abc123', clientSecret: 'ssh-secret' }
];


exports.find = function(id, done) {
  /*for (var i = 0, len = clients.length; i < len; i++) {
    var client = clients[i];
    if (client.id === id) {
      return done(null, client);
    }
  }
  return done(null, null);*/
	dbConn.get(function(err, connection) {
	    if (err){
	    	console.log("Error occurred in clients.js");
	    	return done('Database problem')
	    }
	      
	    connection.query('SELECT * FROM oauth_clients WHERE id = ?',id, function (err, rows) {
	      if (err){
	    	  console.log("Error occurred in clients.js find")
	    	  return done(err)
	      }
	      connection.release();
	      done(null, rows[0])
	    });
	  });
};

exports.findByClientId = function(clientId, done) {
  /*for (var i = 0, len = clients.length; i < len; i++) {
    var client = clients[i];
    if (client.clientId === clientId) {
      return done(null, client);
    }
  }
  return done(null, null);*/
	dbConn.get(function(err, connection) {
	    if (err){
	    	console.log("Error occurred in clients.js")
	    	return done('Database problem')
	    }
	      
	    connection.query('SELECT * FROM oauth_clients WHERE client_id = ?',clientId, function (err, rows) {
	      if (err){
	    	  console.log("Error occurred in clients.js findByClientId")
	    	  return done(err)
	      }
	      connection.release();
	      if(rows.length > 0)
	    	  done(null, rows[0])
	      else
	    	  done("Invalid Client found")
	    });
	  });
};
