var dbConn = require('../util/DBConnection');

exports.addMenu = function(data,done){
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in MenuDAO.js")
			return done('Database problem')
		}
		
    var values = [data.menu_name, data.menu_cat, data.menu_price, data.prod_pckg_style]
	  console.log(values);  	
    connection.query('INSERT INTO products (product_name, product_category, base_price, prod_pckg_style) VALUES(?, ?, ?, ?)', values, function(err, result) {
      if (err){
    	  console.log("Error occurred in MenuDAO.js addMenu")
    	  return done(err);
      }
      connection.release();
      console.log("Menu added Successfully");
      done(null, result.insertId)
    });
});
}

exports.getMenuList = function(req,done){
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in MenuDAO.js")
			return done('Database problem')
		}
		
    connection.query('SELECT * FROM products',function(err, records){
	  if(err){
		  console.log("Error occurred in MenuDAO.js getMenuList");
		  done(err);
	  }
	  connection.release();
	  done(null, records);
	});
});
}

exports.getMenuDetails = function(id,done){
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in MenuDAO.js")
			return done('Database problem')
		}
		
    connection.query('SELECT * FROM products where product_id = ?',id,function(err, records){
	  if(err){
		  console.log("Error occurred in MenuDAO.js getMenuDetails");
		  done(err);
	  }
	  connection.release();
	  done(null, records);
	});
});
}


exports.updateMenu = function(menu,done){
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in MenuDAO.js")
			return done('Database problem')
		}
		
    connection.query('UPDATE products SET product_category = ?,product_name = ?,base_price = ? ,prod_pckg_style = ? WHERE product_id = ?',
    		[menu.menu_cat, menu.menu_name,menu.menu_price, menu.prod_pckg_style, menu.id], function(err, result) {
	  if(err){
		  console.log("Error occurred in MenuDAO.js updateMenu");
		  done(err);
	  }
	  connection.release();
	  done(null, result);
	});
});
	
}	
exports.deleteMenu = function(id,done){
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in MenuDAO.js")
			return done('Database problem')
		}
		
    connection.query('DELETE FROM products where product_id = ?',id,function(err, records){
	  if(err){
		  console.log("Error occurred in MenuDAO.js deleteMenu");
		  done(err);
	  }
	  connection.release();
	  done(null, records);
	});
});
}
