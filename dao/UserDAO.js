var dbConn = require('../util/DBConnection');
var bcrypt = require('../util/BCryptUtil')
exports.getUsers = function(email,done){
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in UserDAO.js");
			return done('Database problem')
		}
		
    connection.query('SELECT * FROM users WHERE email=?',email,function(err, records){
	  if(err){
		  console.log("Error occurred in UserDAO.js getUsers");
		  done(err);
	  }
	  connection.release();
	  done(null, records);
	});
});
}

exports.addUser = function(user_profile,done) {
	dbConn.get(function(err, connection) {
	    if (err){
	    	console.log("Error occurred in UserDAO.js");
	    	return done('Database problem')
	    }
	var values = [user_profile.email, user_profile.email, user_profile.firstName, user_profile.lastName,user_profile.login_type,user_profile.password,user_profile.userSettings_id]
    
    connection.query('INSERT INTO users (email, login, firstName, lastName, login_type , password,userSettings_id) VALUES(?, ?, ?, ?, ?, ?, ?)', values, function(err, result) {
      if (err){
    	  console.log("Error occurred in UserDAO.js addUsers");
    	  return done(err);
      }
      connection.release();
      done(null, result.insertId)
    });
});
}
exports.addLoginUser = function(user_profile,done) {
	dbConn.get(function(err, connection) {
	    if (err){
	    	console.log("Error occurred in UserDAO.js");
	    	return done('Database problem')
	    }
	var values = [user_profile.email, user_profile.password, user_profile.firstName+" "+user_profile.lastName, "*"]
    
    connection.query('INSERT INTO users (email, password, name, scope) VALUES(?, ?, ?, ?)', values, function(err, result) {
      if (err){
    	  console.log("Error occurred in UserDAO.js addLoginuser");
    	  return done(err);
      }
      connection.release();
      done(null, result.insertId)
    });
});
}
var userOnlyPassword = exports.getUserOnlyPassword = function(email,done){
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in UserDAO.js");
			return done('Database problem')
		}
	
	
	connection.query('SELECT password FROM users WHERE email=?',email,function(err, dbPassword){
		if(err){
			console.log("Error occurred in UserDAO.js return user");
			done(err);
		}
//			  connection.release();
		if(dbPassword.length > 0)
			done(null, dbPassword[0].password);  
		else
			done(err);
	});
		
	});
}
var userPassword = exports.getUserPassword = function(email,done){
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in UserDAO.js");
			return done('Database problem')
		}
	connection.query('SELECT password_otp FROM users WHERE email=?',email,function(err, password_otp){
	  if(err){
		  console.log("Error occurred in UserDAO.js updatePassword");
		  done(err);
	  }
	  connection.release();
	  console.log(password_otp[0]);
	  if(password_otp[0] != 'null' && password_otp[0].length > 0){
		  done("Please Reset Your Password");
	  }else{
		  connection.query('SELECT password FROM users WHERE email=?',email,function(err, dbPassword){
			  if(err){
				  console.log("Error occurred in UserDAO.js return user");
				  done(err);
			  }
//			  connection.release();
			  if(dbPassword.length > 0)
				  done(null, dbPassword[0].password);  
			  else
				  done("No Login Record Found");
			});
	  }
		
	});
    
});
}
exports.updatePassword = function(email,password,done){
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in UserDAO.js");
			return done('Database problem')
		}
		
	
    connection.query('UPDATE users SET password = "'+password+'" WHERE email=?',email,function(err,result){
	  if(err){
		  console.log("Error occurred in UserDAO.js");
		  done(err);
	  }
	  connection.release();
	  done(null, result.insertId)
	});
});
}
exports.addOTP = function(user_profile,done) {
	dbConn.get(function(err, connection) {
	    if (err){
	    	console.log("Error occurred in UserDAO.js");
	    	return done('Database problem')
	    }
    connection.query('UPDATE users SET password_otp = "'+user_profile.otp+'" WHERE email = ?',user_profile.email, function(err, result) {
      if (err){
    	  console.log("Error occurred in UserDAO.js addOTP");
    	  return done(err);
      }
      connection.release();
      done(null, result.insertId)
    });
});
}

exports.getUserProfile = function(id,done){
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in UserDAO.js");
			return done('Database problem')
		}
		
    connection.query('SELECT * FROM users WHERE id=?',id,function(err, records){
	  if(err){
		  console.log("Error occurred in UserDAO.js getUserProfile");
		  done(err);
	  }
	  connection.release();
	  done(null, records);
	});
});
}
/*exports.updateUser = function(user_profile,done) {
	dbConn.get(function(err, connection) {
	    if (err){
	    	console.log("Error occurred in UserDAO.js");
	    	return done('Database problem')
	    }
	    if(user_profile.password.length > 0){
	    	userPassword(user_profile.email,function(err,dbPassword) {
	    	    if (err){
	    	    	console.log("Error occurred in UserDAO.js updateUser");
	    	    	return done(err);
	    	    }
	    	    console.log(dbPassword);
	    	    if(dbPassword != undefined && dbPassword.length > 0){
	    	    	bcrypt.comparePassword(user_profile.oldPassword,dbPassword,function(err,isPassMatch){
	    	    		if (err){
	    	    			console.log("Error occurred in UserDAO.js bcrypt comparepass");
	    	    			return done(err)
	    	    		}
	    	    		if(isPassMatch){
	    	    			console.log("Hi");
	    	    			console.log(user_profile.password);
	    	    			bcrypt.cryptPassword(user_profile.password,function(err,encPassword){
	    			    		connection.query('UPDATE users SET firstName = ?,lastName = ?,phoneNumber = ?, password = ? WHERE id = ?',[user_profile.firstName, user_profile.lastName, user_profile.phoneNumber, encPassword , user_profile.user_id], function(err, result) {
	    				    	      if (err){
	    				    	    	  console.log("Error occurred in UserDAO.js cryptPassword");
	    				    	    	  return done(err);
	    				    	      }
	    				    	      connection.release();
	    				    	      console.log("User record updates");
	    				    	      done(null, result);
	    				    	});
	    			    	});
	    	    		}else{
	    	    			console.log("Hello");
	    	    			done("Old Password Is Incorrect");
	    	    		}
	    	    		
	    	    		
	    	    	})
	    	    }else{
	    	    	done('Input data is not in proper format');
	    	    }
	    	    
	      });
	    	
	    	
	    	
	    }else{
	    	connection.query('UPDATE users SET firstName = ?,lastName = ?,phoneNumber = ? WHERE id = ?',[user_profile.firstName, user_profile.lastName, user_profile.phoneNumber, user_profile.user_id], function(err, result) {
	    	      if (err){
	    	    	  console.log("Error occurred in UserDAO.js update users");
	    	    	  return done(err);
	    	      }
	    	      connection.release();
	    	      done(null, result)
    	    });
	    }
    
});
}*/
exports.updateUser = function(user_profile,done) {
	dbConn.get(function(err, connection) {
	    if (err){
	    	console.log("Error occurred in UserDAO.js");
	    	return done('Database problem')
	    }
	    	
    	connection.query('UPDATE users SET firstName = ?,lastName = ?,phoneNumber = ? WHERE id = ?',[user_profile.firstName, user_profile.lastName, user_profile.phoneNumber, user_profile.user_id], function(err, result) {
    	      if (err){
    	    	  console.log("Error occurred in UserDAO.js update users");
    	    	  return done(err);
    	      }
    	      connection.release();
    	      done(null, result);
	    });
    
});
}
exports.updateUserPassword = function(user_profile,done) {
	dbConn.get(function(err, connection) {
	    if (err){
	    	console.log("Error occurred in UserDAO.js");
	    	return done('Database problem')
	    }
	    	
	    if(user_profile.new_password.length > 0){
	    	userPassword(user_profile.email,function(err,dbPassword) {
	    	    if (err){
	    	    	console.log("Error occurred in UserDAO.js updateUser");
	    	    	return done(err);
	    	    }
	    	    console.log(dbPassword);
	    	    if(dbPassword != undefined && dbPassword.length > 0){
	    	    	bcrypt.comparePassword(user_profile.old_password,dbPassword,function(err,isPassMatch){
	    	    		if (err){
	    	    			console.log("Error occurred in UserDAO.js bcrypt comparepass");
	    	    			return done(err)
	    	    		}
	    	    		if(isPassMatch){
	    	    			console.log("Hi");
	    	    			console.log(user_profile.new_password);
	    	    			bcrypt.cryptPassword(user_profile.new_password,function(err,encPassword){
	    			    		connection.query('UPDATE users SET password = ? WHERE id = ?',[encPassword , user_profile.user_id], function(err, result) {
	    				    	      if (err){
	    				    	    	  console.log("Error occurred in UserDAO.js cryptPassword");
	    				    	    	  return done(err);
	    				    	      }
	    				    	      connection.release();
	    				    	      console.log("User record updates");
	    				    	      done(null, result);
	    				    	});
	    			    	});
	    	    		}else{
	    	    			console.log("Hello");
	    	    			done("Old Password Is Incorrect");
	    	    		}
	    	    		
	    	    		
	    	    	})
	    	    }else{
	    	    	done('Input data is not in proper format');
	    	    }
	    	    
	      });
	    	
	    	
	    	
	    }
    
});
}
exports.addUserSettings = function(zoomLevel,done) {
	dbConn.get(function(err, connection) {
	    if (err){
	    	console.log("Error occurred in UserDAO.js");
	    	return done('Database problem')
	    }
    
    connection.query('INSERT INTO user_settings (zoomLevel) VALUES(?)', zoomLevel, function(err, result) {
      if (err){
    	  console.log("Error occurred in UserDAO.js addUserSettings");
    	  return done(err);
      }
      connection.release();
      done(null, result.insertId)
    });
});
}