var express = require('express');
var router = express.Router();
var request = require('request');
var passport = require('passport');
var google = require('googleapis');
var passportgoogle = require('passport-google');
var GoogleTokenStrategy = require('passport-google-id-token');
var GOOGLE_APP_ID = "973998999417-03t2vgo1308110ep300ut9u9387arc6k.apps.googleusercontent.com";
var GOOGLE_APP_SECRET = "SUBpYmMeufOm9nl6_qhvywew"; 	
var dbConn = require('../util/DBConnection');
var accessTokenDAO = require('../dao/AccessTokenDAO');
var userDAO = require('../dao/UserDAO');
var deviceDAO = require('../dao/DeviceDAO'),
	db = require('../db');

var access_token ;
router.post('/auth/google',
		  passport.authenticate('google-id-token'),
		  function (req, res) {
		    // do something with req.user 
		    res.send(req.user? 200 : 401);
		  }
		);
//passport authenticate
passport.use(new GoogleTokenStrategy({
    clientID: GOOGLE_APP_ID,
    getGoogleCerts: ""
  },
  function(parsedToken, googleId, done) {
    access_token = parsedToken.signature;
    var owner_id;
	  var user = {
		        'email': parsedToken.payload.email,
		        'name' : parsedToken.payload.name,
		        'id'   : googleId
		      }
	  console.log(parsedToken);
	  var unique_id = googleId;
	  if(user.email != null && user.email.length > 0){
		 userDAO.getUsers(user.email,function(err,userData) {
			 
		    if (err) return console.log(err)
		    if(userData != undefined && userData.length > 0){
		    	console.log("User record Found");
		    	owner_id = userData[0].id;
		    }else{
		    	var user_profile = {
		    		'email' : parsedToken.payload.email,
		    		'firstName' : parsedToken.payload.given_name,
		    		'lastName' : parsedToken.payload.family_name,
		    		'login_type' : "google"
		    	};
		    	userDAO.addUser(user_profile,function(err,userData) {
				    if (err) return console.log(err);
				    owner_id = userData;
		    	});    
		    }
		    
		  });
				  
		/*  accessTokenDAO.getToken(access_token,function(err,tokenData) {
			    if (err) return console.log(err)
			    if(tokenData != null && tokenData.length > 0){
			    	console.log("Token already exists");
			    }else{
			    	var token_data = {
			    			'token' : access_token,
			    			'user_name' : parsedToken.payload.email,
			    			'client_id': googleId,
			    			'token_provider' : "google" 	
			    	};
			    	accessTokenDAO.addToken(token_data,function(err,tokenData) {
					    if (err) return console.log(err)
					    
				  });
			    }
		  });*/	
		  deviceDAO.getDevice(unique_id,function(err,deviceData) {
			    if (err) return console.log(err)
			    if(deviceData != null && deviceData.length > 0){
			    	console.log("Device already exists");
			    }else{

			    	var device_data = {
			    			'owner_id' : owner_id,
			    			'unique_id' : googleId,
			    			'name' : parsedToken.payload.name
			    	};
			    	deviceDAO.addDevice(device_data,function(err,deviceData) {
					    if (err) return console.log(err)
					    
				  });
			    }
		  });
		  
		  db.accessTokens.deleteToken(access_token, function(err) {
		        if(err) { return done(err); }
		        db.accessTokens.save(access_token, owner_id, googleId, function(err) {
		          if (err) { return done(err); }
		            done(null, access_token);
		        });
	      });
		  
	  }
	  var error = {'error' : 'Error in Access Token Generation'};
	  done(error);
  }
));

/*passport.use(new GoogleTokenStrategy({
    clientID: GOOGLE_APP_ID,
    clientSecret: GOOGLE_APP_SECRET
  }, function(accessToken, refreshToken, profile, done) {
	 
  }
));*/

module.exports = router;