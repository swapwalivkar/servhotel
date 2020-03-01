var userDAO = require('../dao/UserDAO');
var bcrypt = require('../util/BCryptUtil')

var express = require('express');
var router = express.Router();
var passport = require('passport');
var nodemailer = require('nodemailer');
var config = require('../config/config.js')

router.post('/user/getUserProfile', passport.authenticate('bearer', {
	session : false
}), function(req, res) {
	console.log(req.body);
	userDAO.getUserProfile(req.body.user_id, function(err, userProfile) {
		if (err){
	    	console.log("Error Occurred In /user/getUserProfile");
			console.log(err);
			return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
	    }
			
		if (userProfile != null && userProfile.length > 0) {
			console.log("User Record Found:"+userProfile[0].id);
			
			res.status(200).send({firstName : userProfile[0].firstName,lastName:userProfile[0].lastName,phoneNumber:userProfile[0].phoneNumber,email:userProfile[0].email});
		} else {
			res.status(200).send({UserProfile:""});

		}
	});	

});

router.post('/user/updateUser', passport.authenticate('bearer', {
	session : false
}), function(req, res) {
	console.log(req.body);
	userDAO.updateUser(req.body, function(err, userId) {
		if (err){
			console.log("Error Occurred In /user/updateUser");
			console.log(err)
			return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
		}
			
			
		if (userId != null && userId.length > 0) {
			console.log("User Record Found:"+userId);
			
			res.status(200).send({id:userId});
		} else {
			res.status(200).send({id:""});

		}
	});	

});
router.post('/user/updatePassword', passport.authenticate('bearer', {
	session : false
}), function(req, res) {
	console.log(req.body);
	userDAO.updateUserPassword(req.body, function(err, userId) {
		if (err){
			console.log("Error Occurred In /user/updateUser");
			console.log(err)
			return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
		}
			
			
		if (userId != null && userId.length > 0) {
			console.log("User Record Found:"+userId);
			
			res.status(200).send({id:userId});
		} else {
			res.status(200).send({id:""});

		}
	});	
});
/* GET users listing. */
router.post('/users/register', function(req, res, next) {
	console.log(req.body);
	userDAO.getUsers(req.body.email,function(err,userData) {
    if (err){
    	console.log("Error Occurred In /user/register");
		console.log(err);
		return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
    }
    if(userData != undefined && userData.length > 0){
    	console.log("User record Found");
    	res.status(500).json({error: 'Email address is already registered with us'});
    }else{
    	var encPass = '';
    	var encPass = bcrypt.cryptPassword(req.body.password,function(err,password){
    		var userSettingsId = userDAO.addUserSettings("15",function(err,userData) {
    		    if (err) return console.log(err);
    		    
    		    var user_profile = {
    	    		'email' : req.body.email,
    	    		'login' : req.body.email,
    	    		'firstName' : req.body.name,
    	    		'lastName' : '',
    	    		'login_type' : 'App',
    	    		'password' : password,
    	    		'userSettings_id' : userData
    	    	};
        	userDAO.addUser(user_profile,function(err,userData) {
    		    if (err) return console.log(err);
    		    res.status(200).send({user: userData});
        	});  
        	}); 
    		
    		
    		
        	  
    	})
    }
  });
	
});

router.post('/user/login', function(req, res, next) {
	console.log(req.body);
	userDAO.getUserOnlyPassword(req.body.email,function(err,dbPassword) {
		if (err){
	    	console.log("Error Occurred In /user/login");
			console.log(err);
			return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
	    }
	    if(dbPassword != undefined && dbPassword.length > 0){
	    	bcrypt.comparePassword(dbPassword,req.body.password,function(err,isPassMatch){
	    		if (err) return console.log(err)
	    		res.sendStatus(200);
	    		req.session.loginStatus = true;
	    	})
	    }else{
	    	res.status(500).json({error: 'Input data is not in proper format. Login Failed!'});
	    }
	    res.status(500).json({error: 'Login Failed'});
	    
  });
	
});	
router.post('/user/forgotpassword', function(req, res, next) {
	console.log(req.body);
	userDAO.getUsers(req.body.email,function(err,userData) {
		if (err){
	    	console.log("Error Occurred In /user/forgotpassword");
			console.log(err);
			return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
	    }
    if(userData != undefined && userData.length > 0){
    	var otp = Math.random().toString(36).substring(2,8).toUpperCase();
//    	userDAO.updatePassword(req.body.email,'',function(err) {
//    		if(err) res.json({500:"Something went wrong, Please try Again"});
    		var user_profile = {
    	    		'email' : req.body.email,
    	    		'otp' : otp
	    	};
    		userDAO.addOTP(user_profile,function(err) {
        		if(err) res.json({500:"Something went wrong, Please try Again"});
        		var transporter = nodemailer.createTransport({
                    service: config.emailing.service,
                    auth: {
                        user: config.emailing.auth.user, // Your email id
                        pass: config.emailing.auth.pass // Your password
                    }
                });
            	var text = 'Hello ' + userData[0].firstName+'<br>'+'We have recieved your request to reset the password.<br>'
            	+'Please enter OTP <b><i>'+otp+'</i></b> while reseting your password.<br>'+
            	'Regards,<br><br>IOTmize Team.';
            	var mailOptions = {
            		    from: config.mailoptions.from, // sender address
            		    to: req.body.email, // list of receivers
            		    subject: 'IOTmize Forgot Password | OTP', // Subject line
            		    html: text //, // plaintext body
            		    // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
        		};
            	
            	transporter.sendMail(mailOptions, function(error, info){
            	    if(error){
            	        console.log(error);
            	        res.json({yo: 'error'});
            	    }else{
            	        console.log('Message sent: ' + info.response);
            	        res.json({yo: info.response});
            	    };
            	});	
        		
        		
        	});
    		
    		
//    	});
    	
    	
    }else{
    	res.status(500).json({error: 'Email address is NOT registered with us'});
    
    }
  });
	
});	
router.post('/user/resetPassword', function(req, res, next) {
	console.log(req.body);
	userDAO.getUsers(req.body.email,function(err,userData) {
		if (err){
	    	console.log("Error Occurred In /user/resetPassword");
			console.log(err);
			return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
	    }
    if(userData != undefined && userData.length > 0){
    	console.log(userData[0].password_otp);
		if(userData[0].password_otp == req.body.otp){
			
			var encPass = bcrypt.cryptPassword(req.body.password,function(err,password){
				userDAO.updatePassword(req.body.email,password,function(err) {
		    		if(err) res.json({500:"Something went wrong, Please try Again"});
		    		
		    		var user_profile = {
		    	    		'email' : req.body.email,
		    	    		'otp' : ''
			    	};
		    		userDAO.addOTP(user_profile,function(err) {
		        		if(err) res.json({500:"Something went wrong, Please try Again"});
		        		
		        		res.status(200).json({'status': 'Your password updated successfully!'});
		    		});
		    		
		    		
				});  
	        	  
	    	})
			
		}else{
			res.status(500).json({error: 'Please Enter Valid OTP'});
		}
    }else{
    	res.status(500).json({error: 'Email address is NOT registered with us'});
    }
  });
	
});	

router.get('/login', function(req, res, next) {
	 next(null, res);
});	
router.get('/my/login' , function(req,res,next){
	console.log("Reached here");
	var userData = [ 
    	            {"Parameter": "Memory","MinThreshold": 10004, "MaxThreshold": 2345 ,"Type": "Number" }, 
    	            {"Parameter": "CPU","MinThreshold": 10040, "MaxThreshold": 1234, "Type": "Number"}, 
    	            {"Parameter": "RAM","MinThreshold": 123, "MaxThreshold": 100, "Type": "Percent"}
    	           ];
	res.status(200).send({data: userData});
	//res.end(res.writeHead(200, "My data", {'content-type' : 'text/plain'}));
});
module.exports = router;


