var dbConn = require('../util/DBConnection');

exports.addOffer = function(data,done){
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in OfferDAO.js")
			return done('Database problem')
		}
		
    var values = [data.customer_id, data.product_id, data.product_price]
	  console.log(values);  	
    connection.query('INSERT INTO customer_products (customer_id, product_id, product_price) VALUES(?, ?, ?)', values, function(err, result) {
      if (err){
    	  console.log("Error occurred in OfferDAO.js addOffer")
    	  return done(err);
      }
      connection.release();
      console.log("Offer added Successfully");
      done(null, result.insertId)
    });
});
}

exports.getOfferList = function(req,done){
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in OfferDAO.js")
			return done('Database problem')
		}
	
    connection.query('select cps.offer_id,prod.base_price as base_price,cust.name as cust_name,prod.product_name as product_name,cps.product_price as product_price from customer_products AS cps ' +
	'inner Join products as prod '+
		'ON (cps.product_id = prod.product_id ) '+
	'inner Join customers as cust '+
		'ON (cps.customer_id = cust.customer_id ) ',function(err, records){
	  if(err){
		  console.log("Error occurred in OfferDAO.js getOfferList");
		  done(err);
	  }
	  connection.release();
	  done(null, records);
	});
});
}

exports.getOfferDetails = function(offer,done){
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in OfferDAO.js")
			return done('Database problem')
		}
    connection.query('SELECT * FROM customer_products where product_id = ? AND customer_id = ?',[offer.product_id,offer.customer_id],function(err, records){
	  if(err){
		  console.log("Error occurred in OfferDAO.js getOfferDetails");
		  done(err);
	  }
	  connection.release();
	  done(null, records);
	});
});
}


exports.updateOffer = function(offer,done){
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in OfferDAO.js")
			return done('Database problem')
		}
		
    connection.query('UPDATE customer_products SET product_price = ? WHERE product_id = ? AND customer_id = ?',
    		[offer.product_price, offer.product_id, offer.customer_id], function(err, result) {
	  if(err){
		  console.log("Error occurred in OfferDAO.js updateoffer");
		  done(err);
	  }
	  connection.release();
	  done(null, result);
	});
});
	
}	

exports.getBalanceSheet = function(req,done){
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in OfferDAO.js")
			return done('Database problem')
		}
	
    connection.query('SELECT * FROM orders GROUP BY customer_id ',function(err, records){
	  if(err){
		  console.log("Error occurred in OfferDAO.js getBalanceSheet");
		  done(err);
	  }
	  connection.release();
	  done(null, records);
	});
});
}