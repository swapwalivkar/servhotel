var dbConn = require('../util/DBConnection');

exports.addCustomer = function(data,done){
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in CustomerDAO.js")
			return done('Database problem')
		}
		
    var values = [data.cust_name, data.cust_contact, data.cust_add,  data.cust_email]
    console.log(data.cust_contact);
    console.log(data.cust_add);    	
    connection.query('INSERT INTO customers (name, contact_no, address, email_id) VALUES(?, ?, ?, ?)', values, function(err, result) {
      if (err){
    	  console.log("Error occurred in CustomerDAO.js addCustomer")
    	  return done(err);
      }
      connection.release();
      console.log("Customer added Successfully");
      done(null, result.insertId)
    });
});
}

exports.getCustList = function(req,done){
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in CustomerDAO.js")
			return done('Database problem')
		}
		
    connection.query('SELECT * FROM customers',function(err, records){
	  if(err){
		  console.log("Error occurred in CustomerDAO.js getCustList");
		  done(err);
	  }
	  connection.release();
	  done(null, records);
	});
});
}

exports.getCustDetails = function(id,done){
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in CustomerDAO.js")
			return done('Database problem')
		}
		
    connection.query('SELECT * FROM customers where customer_id = ?',id,function(err, records){
	  if(err){
		  console.log("Error occurred in CustomerDAO.js getCustDetails");
		  done(err);
	  }
	  connection.release();
	  done(null, records);
	});
});
}


exports.updateCust = function(cust,done){
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in CustomerDAO.js")
			return done('Database problem')
		}
console.log(cust);		
    connection.query('UPDATE customers SET name = ?,address = ?,contact_no = ?,email_id = ? WHERE customer_id = ?',
    		[cust.name, cust.address,cust.contact, cust.email, cust.id], function(err, result) {
	  if(err){
		  console.log("Error occurred in CustomerDAO.js updateCust");
		  done(err);
	  }
	  connection.release();
	  done(null, result);
	});
});
	
}	
exports.deleteCust = function(id,done){
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in CustomerDAO.js")
			return done('Database problem')
		}
		
    connection.query('DELETE FROM customers where customer_id = ?',id,function(err, records){
	  if(err){
		  console.log("Error occurred in ExpenseDAO.js deleteCust");
		  done(err);
	  }
	  connection.release();
	  done(null, records);
	});
});
}
