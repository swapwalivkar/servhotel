var dbConn = require('../util/DBConnection');

exports.getDevice = function(uniqueId,done){
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in DeviceDAO.js")
			return done('Database problem')
		}
		
    connection.query('SELECT * FROM devices WHERE uniqueId = ?',uniqueId,function(err, records){
	  if(err){
		  console.log("Error occurred in DeviceDAO.js getDevice")
		  done(err);
	  }
	  connection.release();
	  done(null, records);
	});
});
}

exports.addDevice = function(data,done) {
	dbConn.get(function(err, connection) {
	    if (err){
	    	console.log("Error occurred in DeviceDAO.js")
	    	return done('Database problem')
	    }
	    
	var values = [data.unique_id, data.name, data.owner_id, data.server_auth_code]
	    	
    connection.query('INSERT INTO devices (uniqueId, name, owner_id, serverAuthCode) VALUES(?, ?, ?, ?)', values, function(err, result) {
      if (err){
    	  console.log("Error occurred in DeviceDAO.js addDevice")
    	  return done(err);
      }
      connection.release();
      console.log("Device added Successfully");
      
      dbConn.get(function(err, connection) {
  	    if (err) return done('Database problem')
      var mapping_values = [result.insertId, data.owner_id]
      connection.query('INSERT INTO users_devices (devices_id, users_id) VALUES(?, ?)', mapping_values, function(err, result) {
          if (err){
        	  console.log("Error occurred in DeviceDAO.js adding mapping")
        	  return done(err);
          }
          connection.release();
          console.log("Device Users Mapping added Successfully");
        });
      });
      
      /*dbConn.get(function(err, connection) {
    	    if (err) return done('Database problem')
        var mapping_values = [result.insertId, data.server_auth_code]
        connection.query('INSERT INTO devices_server_auth (device_id, server_auth_code) VALUES(?, ?)', mapping_values, function(err, result) {
            if (err) return done(err);
            connection.release();
            console.log("Devices Server Auth Mapping Added");
          });
        });*/
      done(null, result.insertId)
    });
});
}

exports.deleteDevice = function(unique_id,done) {
	dbConn.get(function(err, connection) {
	    if (err){
	    	console.log("Error occurred in DeviceDAO.js")
	    	return done('Database problem')
	    }
	    
    connection.query('DELETE FROM devices WHERE id = ?', unique_id, function(err, result) {
      if (err){
    	  console.log("Error occurred in DeviceDAO.js deleteDevice ")
    	  return done(err);
      }
      connection.release();
      console.log("Device Deleted Successfully");
      
      dbConn.get(function(err, connection) {
  	    if (err){
  	    	console.log("Error occurred in DeviceDAO.js")
  	    	return done('Database problem')
  	    }
  	    
	      connection.query('DELETE FROM users_devices WHERE devices_id = ?', unique_id, function(err, result) {
	        if (err){
	        	console.log("Error occurred in DeviceDAO.js delete mapping")
	        	return done(err);
	        }
	        connection.release();
	        console.log("Device Users Mapping Deleted Successfully");
	      });
      });
      
      done(null, "Device Deleted")
    });
});
}
exports.getServerAuthCode = function(id,done){
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in DeviceDAO.js")
			return done('Database problem')
		}
		
    connection.query('SELECT * FROM devices WHERE id = ?',id,function(err, records){
	  if(err){
		  console.log("Error occurred in DeviceDAO.js getServerAuthCode");
		  done(err);
	  }
	  connection.release();
	  done(null, records[0]);
	});
});
}
exports.getLastLocation = function(uniqueId,done){
	
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in DeviceDAO.js")
			return done('Database problem')
		}
		
    connection.query('SELECT * FROM devices WHERE uniqueId = ?',uniqueId,function(err, records){
	  if(err){
		  console.log("Error occurred in DeviceDAO.js getDevice")
		  done(err);
	  }
	  connection.release();
	  if(records.length > 0){
		  dbConn.get(function(err, connection) {
				if (err){
					console.log("Error occurred in DeviceDAO.js")
					return done('Database problem')
				}
				
			if(records[0].latestPosition_id != null){	
		    connection.query('SELECT * FROM positions WHERE id = ?',records[0].latestPosition_id,function(err, records){
			  if(err){
				  console.log("Error occurred in DeviceDAO.js getLastLocation")
				  done(err);
			  }
			  connection.release();
			  if(records.length > 0)
				  done(null, records[0]);
			  else
				  done(null,"No location records found for given device");
			});
			}else{
				connection.release();
				done(null,"No location records found for given device");
			}
		 });
	  }else{
		  done(null,"No location records found for given device");
	  }
	  
	});
    
	
});
}
exports.updateUserId = function(id,owner_id,done){
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in DeviceDAO.js");
			return done('Database problem')
		}
		
	
    connection.query('UPDATE devices SET owner_id = "'+owner_id+'" WHERE id=?',id,function(err,result){
	  if(err){
		  console.log("Error occurred in updateUserId DeviceDAO.js");
		  done(err);
	  }
	  connection.release();
	  done(null, result.insertId)
	});
});
}
exports.registerTracking = function(tracking_data,done){
	dbConn.get(function(err, connection) {
	    if (err){
	    	console.log("Error occurred in DeviceDAO.js")
	    	return done('Database problem')
	    }
	   

	    var values = [tracking_data.user_id, tracking_data.device_id, tracking_data.exp_time, tracking_data.mode,tracking_data.users]
	    	
    connection.query('INSERT INTO tracklink_history (user_id, device_id, exp_time, mode, users) VALUES(?, ?, ?, ?, ?)', values, function(err, result) {
      if (err){
    	  console.log("Error occurred in DeviceDAO.js registerTracking")
    	  return done(err);
      }
      connection.release();
      console.log("Link Tracking History Added Successfully");
      done(null);
    });
});
}
exports.getSchoolDevices = function(deviceType,done){
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in DeviceDAO.js")
			return done('Database problem')
		}
		
    connection.query('SELECT * FROM devices WHERE iconType = ?',deviceType,function(err, records){
	  if(err){
		  console.log("Error occurred in DeviceDAO.js getSchoolDevices")
		  done(err);
	  }
	  connection.release();
	  done(null, records);
	});
});
}
/*exports.getServerAuthCode = function(id,done){
	dbConn.get(function(err, connection) {
		if (err) return done('Database problem')
		
    connection.query('SELECT * FROM devices_server_auth WHERE device_id = ?',id,function(err, records){
	  if(err) throw err;
	  connection.release();
	  done(null, records[0]);
	});
});
}
*/