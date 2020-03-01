/**
 * Module dependencies.
 */
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , BasicStrategy = require('passport-http').BasicStrategy
  , ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy
  , BearerStrategy = require('passport-http-bearer').Strategy
  , db = require('./db')
  , config = require( './config/config.js' )
  , bcrypt = require('./util/BCryptUtil');


passport.use(new LocalStrategy(
  function(username, password, done) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { 
    	  console.log("Error occurred in auth.js passport.use users.findByUsername");
    	  console.log(err);
    	  return done(err); 
      }
      if (!user) { return done(null, false); }
      if (user.password != password) { return done(null, false); }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.users.find(id, function (err, user) {
	  if (err) { 
    	  console.log("Error occurred in auth.js passport.deserializeUser users.find");
    	  console.log(err);
    	  return done(err); 
      }
    done(err, user);
  });
});


passport.use('basic',new BasicStrategy(
  function(username, password, done) {
	  console.log("Username: "+username);
	  db.users.findByUsername(username, function(err, user) {
	      if (err) { 
	    	  console.log("Error occurred in auth.js passport.use users.findByUsername");
	    	  return done(err); 
	      }
	      if (!user) { return done(null, false); }
	      
	      console.log("Hello: "+user.password+" , "+password);
	      bcrypt.comparePassword(password,user.password,function(err,isPassMatch){
	    		if (err){
	    			console.log("Error occurred in auth.js passport.use bcrypt.comparePassword");
	    			console.log(err);
//	    			return done(err);
	    		}
	    		if(isPassMatch)
	    			 return done(null, user);
	    		else
    	    	    return done(null, false);
	      })
//	      return done(null, user);
    });
  }
));

passport.use('oauth2-client-password',new ClientPasswordStrategy(
  function(clientId, clientSecret, done) {
    db.clients.findByClientId(clientId, function(err, client) {
      if (err) {
    	  console.log("Error occurred in auth.js passport.use clients.findByClientId");
		  console.log(err);
    	  return done(err); 
	  }
      if (!client) { return done(null, false); }
      if (client.clientSecret != clientSecret) { return done(null, false); }
      return done(null, client);
    });
  }
));

passport.use(new BearerStrategy(
  function(accessToken, done) {
    db.accessTokens.find(accessToken, function(err, token) {
      if (err) {
    	  console.log("Error occurred in auth.js passport.use accessTokens.find");
			console.log(err);
    	  return done(err); 
      }
      if (!token) { return done(null, false); }
     /* if( Math.round((Date.now()-token.created)/1000) > config.security.tokenLife ) {
    	  db.accessTokens.deleteToken(accessToken, function (err) {
              if (err) return done(err);
          });
    	  var error = { message: 'Token expired' };
          done(error);
      }else{
    	  db.accessTokens.updateExpiry(accessToken, function(err) {
              if (err) { return done(err); }
          });
      }*/
          
      db.users.find(token.user_id, function(err, user) {
        if (err) {
        	console.log("Error occurred in auth.js passport.use users.find");
			console.log(err);
        	return done(err); 
        }
        if (!user) { return done(null, false); }
        // to keep this example simple, restricted scopes are not implemented,
        // and this is just for illustrative purposes
        var info = { scope: '*' }
        done(null, user, info);
      });
    });
  }
));
