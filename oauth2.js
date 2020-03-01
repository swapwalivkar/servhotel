/**
 * Module dependencies.
 */
var oauth2orize = require('oauth2orize')
  , passport = require('passport')
  , login = require('connect-ensure-login')
  , db = require('./db')
  , utils = require('./utils')
  , auth = require('./auth')
  , BasicStrategy = require('passport-http').BasicStrategy;

// create OAuth 2.0 server
var server = oauth2orize.createServer();
var express = require('express');
var router = express.Router();
var userDAO = require('./dao/UserDAO');
var bcrypt = require('./util/BCryptUtil');
var deviceDAO = require('./dao/DeviceDAO');
this.server_auth_code = '';
server.serializeClient(function(client, done) {
  return done(null, client.id);
});

server.deserializeClient(function(id, done) {
  db.clients.find(id, function(err, client) {
    if (err) { 
    	console.log("Error occurred in oauth2 server.deserializeClient");
    	return done(err); 
    }
    return done(null, client);
  });
});

server.grant(oauth2orize.grant.code(function(client, redirectURI, user,ares, done) {
  var code = utils.uid(16);
  var userId = user.id;
  db.authorizationCodes.save(code, client.id, redirectURI, userId, function(err) {
    if (err) {
    	console.log("Error occurred in oauth2 server.grant authorizationcode.save");
    	return done(err); 
    }
    done(null, code);
  });
}));


server.exchange(oauth2orize.exchange.code(function(client, code, redirectURI, done) {
  db.authorizationCodes.find(code, function(err, authCode) {
    if (err) {
    	console.log("Error occurred in oauth2 server.excahnge authorizationcode.find");
    	return done(err); 
    }
    if (authCode === undefined) { return done(null, false); }
//    if (client.id !== authCode.client_id) { return done(null, false); }
    if (redirectURI !== authCode.redirect_uri) { return done(null, false); }
    	
      db.authorizationCodes.deleteAuthCode(code, function(err) {
        if(err) { 
        	console.log("Error occurred in oauth2 server.excahnge authorizationcode.deleteAuthCode");
        	return done(err); 
        }
        var token = utils.uid(256);
        db.accessTokens.save(token, authCode.user_id, authCode.client_id, function(err) {
          if (err) {
        	  console.log("Error occurred in oauth2 server.exchange accessTokens.save");
        	  return done(err); 
          }
          done(null, token);
        });
      });
  });
}));

server.exchange(oauth2orize.exchange.password(function(client, username, password, scope, done) {
	db.clients.findByClientId(client, function(err,client) {
        if (err) { 
        	console.log("Error occurred in oauth2 server.exchange clients.findByClientId");
        	return done(err); 
    	}
	    db.users.loginCheck({ username: username }, function(err, user) {
	        if (err) {
	        	console.log("Error occurred in oauth2 server.exchange users.loginCheck");
	        	return done(err); 
	        }
	        if (!user) { 
	        	return done(null, false); 
	        }
        
            var token = utils.uid(256);
            db.accessTokens.save(token, user.id, client.id, function(err) {
              if (err) {
            	  console.log("Error occurred in oauth2 server.exchange accessTokens.save");
            	  return done(err); 
              }
              done(null, token);
            });
        });
        
    });
}));

exports.authorization = [
  server.authorization(function(clientID, redirectURI, done) {
    db.clients.findByClientId(clientID, function(err, client) {
    	
      if (err) {
    	  console.log("Error occurred in oauth2 exports.authorization clients.findByClientId");
    	  return done(err); 
      }
      return done(null, client, redirectURI);
    });
  }),
  function(req, res, next){
	  var pass = req.body.password;
	  db.users.findByUsername(req.body.username, function(err, user_details) {
	      if (err) { 
	    	  console.log("Error Occurred in oauth2 exports.authorization users.findByUsername");
				console.log(err);
				return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
	      } //res.send('Error occured while login');}
	      if(user_details == undefined || !user_details || err){
	    	  res.status(401).send('Unauthorized')
	      }else{
	    	  console.log("Hello: "+user_details.id);
	    	  bcrypt.comparePassword(pass,user_details.password,function(err,isPassMatch){
		    		if (err){
		    			console.log("Error Occurred In /user/getUserProfile");
		    			console.log(err);
		    			return done(err);
		    		}
		    		if(!isPassMatch)
		    			res.status(401).send('Unauthorized')
		    		else{
			    		var server_auth_code = '';	
	    				deviceDAO.getDevice(req.body.id, function(err, deviceData) {
						if (err){
						    	console.log("Error Occurred In deviceService.getDevice");
								console.log(err);
								return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
						    }
							
						if (deviceData != null && deviceData.length > 0) {
							console.log("Device already exists:"+deviceData[0].id);
							deviceDAO.updateUserId(deviceData[0].id,user_details.id, function(err, userId) {
								if (err){
							    	console.log("Error Occurred In oauth2.updateUserId");
									console.log(err);
									return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
							    }
								console.log("User Id updated for device id: "+deviceData[0].id);
								deviceDAO.getServerAuthCode(deviceData[0].id, function(err, server_code) {
									if (err){
									    	console.log("Error Occurred In deviceService.getServerAuthCode");
											console.log(err);
											return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
									    }
			 		    		    this.server_auth_code = server_code.serverAuthCode;
			 		    		    console.log("Server Auth Code is: "+this.server_auth_code);
								});
							});
							
						} else {
								server_auth_code = Math.random().toString(36).substring(2,8);	
								console.log("Registering new Device ");
								var device_data = {
									'owner_id' : user_details.id,
									'unique_id' : req.body.id,
									'name' : req.body.name,
									'server_auth_code' : server_auth_code
								};
								deviceDAO.addDevice(device_data, function(err, deviceData) {
									if (err){
								    	console.log("Error Occurred In deviceService.addDevice");
										console.log(err);
										return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
								    }
								});
								this.server_auth_code = server_auth_code;
								console.log("Server Auth Code is: "+this.server_auth_code);
						}
		    			req.user = user_details;
		    			req.body = req.query;
		    		    req.body.transaction_id = req.oauth2.transactionID;

		    		    return next();	
					});
		    		
	    		}
	      });
      }
    });
  },
  server.decision(),
  server.errorHandler()
]


exports.decision = [
//  login.ensureLoggedIn(),
  server.decision()
]

exports.authocode = [
	function(req, res, done){
        res.send(req.query);
    }
]

exports.token = [
  passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
  server.token(),
  server.errorHandler()
]

