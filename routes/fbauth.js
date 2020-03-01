var express = require('express');
var router = express.Router();
var passport = require('passport');
var passportfb = require('passport-facebook');
var cronJob = require('cron').CronJob;
//var User = require('../models/User');
var FacebookTokenStrategy = require('passport-facebook-token');
var FACEBOOK_APP_ID = "606839982812664";
var FACEBOOK_APP_SECRET = "67467b67ab28a8d870c4872ad8cfae48"; 	
var dbConn = require('../util/DBConnection');
var accessTokenDAO = require('../dao/AccessTokenDAO');
var userDAO = require('../dao/UserDAO');
var deviceDAO = require('../dao/DeviceDAO'),
	db = require('../db');



router.post('/auth/facebook/token',
		  passport.authenticate('facebook-token'),
		  function (req, res) {
			console.log(res);
		    // do something with req.user 
		    res.send(req.user? 200 : 401);
		  });

//passport authenticate
passport.use(new FacebookTokenStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET
  }, function(accessToken, refreshToken, profile, done) {
	  var owner_id;
	  var user = {
		        'email': profile.emails[0].value,
		        'name' : profile.name.givenName + ' ' + profile.name.familyName,
		        'id'   : profile.id
		      }
	  console.log(profile);
	  var unique_id = profile.id;
	  if(user.email != null && user.email.length > 0){
		  
		 userDAO.getUsers(user.email,function(err,userData) {
		    if (err) return console.log(err)
		    if(userData != undefined && userData.length > 0){
		    	console.log("User record Found");
		    	owner_id = userData[0].id;
		    }else{
		    	var user_profile = {
		    		'email' : profile.emails[0.].value,
		    		'firstName' : profile.name.givenName,
		    		'lastName' : profile.name.familyName,
		    		'login_type' : profile.provider
		    	};
		    	dbConn.addUser(user_profile,function(err,userData) {
				    if (err) return console.log(err);
				    owner_id = userData;
		    	});    
		    }
		    console.log(owner_id);
		    
		  });
				  
		 /* accessTokenDAO.getToken(accessToken,function(err,tokenData) {
			    if (err) return console.log(err)
			    console.log("Access Token Reacord: "+tokenData);
			    if(tokenData != null && tokenData.length > 0){
			    	console.log("Token already exists");
			    }else{
			    	var token_data = {
			    			'token' : accessToken,
			    			'user_name' : profile.emails[0].value,
			    			'client_id': profile.id,
			    			'token_provider' : profile.provider 	
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
			    			'unique_id' : profile.id,
			    			'name' : profile.displayName
			    	};
			    	deviceDAO.addDevice(device_data,function(err,deviceData) {
					    if (err) return console.log(err)
					    
				  });
			    }
		  });
		  
		  db.accessTokens.deleteToken(accessToken, function(err) {
		        if(err) { return done(err); }
		        db.accessTokens.save(accessToken, owner_id, profile.id, function(err) {
		          if (err) { return done(err); }
		            done(null, accessToken);
		        });
	      });
		  
	  }
	  //var myJob = new cronJob('*/5 * * * * *', function(){
	/*		console.log("Calling FB Job");
			FacebookTokenStrategy.prototype.userProfile = function(accessToken, done){
				
			}
		});
		myJob.start();*/ 
	  var error = {'error' : 'Error in Access Token Generation'};
	  done(error);
  }
));

module.exports = router;