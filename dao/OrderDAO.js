var dbConn = require('../util/DBConnection');

exports.addOrder = function(data,done){
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in OrderDAO.js")
			return done('Database problem')
		}
		
	var values = [data.customer_id, data.total_amount,  data.tran_cost,  data.pckg_cost, data.discount, data.grand_total, data.gst,data.order_date]
	
	var values_bsheet = [data.customer_id, data.grand_total,data.grand_total];
	var qua = parseInt(data.can_quantity);
	var rate = parseInt(data.can_rate);
	var deposit_amount = qua * rate;
	var values_can_detail = [data.customer_id, data.can_quantity,data.can_quantity,data.can_rate,deposit_amount,'NA'];    	
	console.log('Can Details');
	console.log(values_can_detail);
    connection.query('INSERT INTO orders (customer_id, total_price, tran_cost, pckg_cost, discount, grand_total,gst,created) VALUES(?,?, ? ,? ,?, ?, ?, ?)', values, function(err, result) {
      if (err){
    	  console.log("Error occurred in OrderDAO.js addOrder")
    	  return done(err);
      }
		  connection.release();
			var menus = JSON.parse(data.menu_items);
			dbConn.get(function(err, connection) {
  	    if (err){
  	    	console.log("Error occurred in OrderDAO.js")
  	    	return done('Database problem')
  	    }
			
			var i = 0;
			
		dbConn.get(function(err, connection) {
  	    if (err){
  	    	console.log("Error occurred in OrderDAO.js")
  	    	return done('Database problem')
				}
				var add_items =  [];
				for (i in menus){
				console.log(menus[i]);
				var quantity_pckg_style = menus[i].quantity+' '+menus[i].pckg_style;
				add_items = [menus[i].id,'NA',menus[i].quantity,menus[i].total, result.insertId, menus[i].price, menus[i].item_name, quantity_pckg_style];	
					connection.query('INSERT INTO order_menu (menu_id, remark, quantity, total,  order_id, price, item_name, quantity_pckg_style) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', add_items, function(err, result) {
					if (err){
						console.log("Error occurred in OrderDAO.js addOrderMenu")
						return done(err);
					}	

					});	
			}				
			connection.release();
			});
			dbConn.get(function(err, connection) {
				if (err){
					console.log("Error occurred in OrderDAO.js")
					return done('Database problem')
				}
				
				connection.query('SELECT * FROM balance_sheet where customer_id = ?',data.customer_id,function(err, records){
				if(err){
					console.log("Error occurred in OrderDAO.js getTotalPriceByCustomer");
					done(err);
				}
				connection.release();
			
				if(records != undefined && records.length > 0){
					var lastTotal = parseFloat(records[0].total_amount);
					var lastBal = parseFloat(records[0].balance_amount);
					var curr_total = parseFloat(data.grand_total);
					var total = curr_total + lastTotal;
					var bal = curr_total + lastBal;
					var updateValues =  [bal, total,records[0].balance_sheet_id]
					
					module.exports.updateTotalAmount(updateValues, function(err, bsheetData) {
						console.log("In Balance Sheet Update: "+bsheetData);
					});
				}else{
					module.exports.insertBSheet(values_bsheet, function(err, bsheetData) {
						console.log("In Balance Sheet Insert: "+bsheetData);
					});
				}
				
			});
		});
		//Update  Can Details
		dbConn.get(function(err, connection) {
			if (err){
				console.log("Error occurred in OrderDAO.js")
				return done('Database problem')
			}
			
			connection.query('SELECT * FROM can_details where customer_id = ?',data.customer_id,function(err, records){
			if(err){
				console.log("Error occurred in OrderDAO.js getTotalPriceByCustomer");
				done(err);
			}
			connection.release();
		
			if(records != undefined && records.length > 0){
				var can_quantity = parseFloat(records[0].can_quantity);				
				var can_remaining = parseFloat(records[0].can_remaining);				
				var curr_can_quantity = parseFloat(data.can_quantity);
				var can_rate = parseFloat(data.can_rate);
				var total = can_quantity + curr_can_quantity;
				var deposit = total * can_rate;
				var remain = can_remaining + curr_can_quantity;
				var updateValues =  [total,remain,deposit,records[0].can_detail_id]
				
				module.exports.updateCanTotal(updateValues, function(err, bsheetData) {
					console.log("In Can Detail Update: ");
				});
			}else{
				module.exports.insertCanDetail(values_can_detail, function(err, bsheetData) {
					console.log("In  Can Detail Insert: ");
				});
			}
			
		});
	});	
      console.log("Order added Successfully");
      done(null, result.insertId)
    });
});
});
}

exports.getOrders = function(req,done){
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in OrderDAO.js")
			return done('Database problem')
		}
		
    connection.query('select *,DATE_FORMAT(od.created,\'%d-%m-%y\') as order_date from orders as od INNER JOIN customers as cu ON (od.customer_id = cu.customer_id) ',function(err, records){//WHERE od.delivery_status != "Cancelled"
	  if(err){
		  console.log("Error occurred in OrderDAO.js getOrders");
		  done(err);
	  }
	  connection.release();
	  done(null, records);
	});
});
}

exports.getOrderDetails = function(id,done){
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in OrderDAO.js")
			return done('Database problem')
		}
		
    connection.query('select *,od.created as order_date from orders as od INNER JOIN customers as cu ON (od.customer_id = cu.customer_id) where order_id = ?',id,function(err, records){
	  if(err){
		  console.log("Error occurred in OrderDAO.js getOrderDetails");
		  done(err);
	  }
	  connection.release();
	  done(null, records);
	});
});
}


exports.getMenuForOrder = function(id,done){
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in OrderDAO.js")
			return done('Database problem')
		}
		
    connection.query('SELECT * FROM order_menu where order_id = ?',id,function(err, records){
	  if(err){
		  console.log("Error occurred in OrderDAO.js getMenuForOrder");
		  done(err);
	  }
	  connection.release();
	  done(null, records);
	});
});
}
exports.getDeliveryPerson = function(company,done){
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in OrderDAO.js")
			return done('Database problem')
		}
		
    connection.query('SELECT * FROM users where companyName = ?',company,function(err, records){
	  if(err){
		  console.log("Error occurred in OrderDAO.js getDeliveryPerson");
		  done(err);
	  }
	  connection.release();
	  done(null, records);
	});
});
}	

exports.updateOrder = function(orders,done){
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in OrderDAO.js")
			return done('Database problem')
		}
		
    connection.query('UPDATE orders SET delivery_status = ?,assigned_to = ?,created = ? WHERE order_id = ?',
    		[orders.delivery_status, orders.assigned_to, orders.order_date, orders.order_id ], function(err, result) {
	  if(err){
		  console.log("Error occurred in OrderDAO.js updateOrder");
		  done(err);
	  }
	connection.release();
	if(orders.delivery_status == 'Cancelled'){
		dbConn.get(function(err, connection) {
				if (err){
					console.log("Error occurred in OrderDAO.js")
					return done('Database problem')
				}
				
				connection.query('SELECT * FROM balance_sheet where customer_id = ?',orders.customer_id,function(err, records){
				if(err){
					console.log("Error occurred in OrderDAO.js getTotalPriceByCustomer");
					done(err);
				}
				connection.release();
			
				if(records != undefined && records.length > 0){
					
					var lastTotal = parseFloat(records[0].total_amount);
					var lastBal = parseFloat(records[0].balance_amount);
					var curr_total = parseFloat(orders.grand_total);
					var total = lastTotal - curr_total;
					var bal = lastBal - curr_total;
					var updateValues =  [bal, total,records[0].balance_sheet_id]
					
					module.exports.updateTotalAmount(updateValues, function(err, bsheetData) {
						console.log("In Balance Sheet Update: "+bsheetData);
					});
				}
			
				});
			});
		}
	  done(null, result);
	});
});
	
}	


exports.updateCanDetails = function(orders,done){
	
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in OrderDAO.js");
			return done('Database problem');
		}
		
    connection.query('UPDATE can_details SET deposit_amount = ?,can_quantity = ?,can_remaining = ?, can_received = ? , can_received_date = ? WHERE can_detail_id = ?',orders, function(err, result) {
	  if(err){
		  console.log("Error occurred in OrderDAO.js updateCanDetails");
		  done(err);
	  }
	  connection.release();
	  done(null, result);
	});
});
}
exports.updateBSheet = function(orders,done){
	console.log("In Update Bsheet");
	console.log(orders);
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in OrderDAO.js");
			return done('Database problem');
		}
		
    connection.query('UPDATE balance_sheet SET paid_amount = ?,balance_amount = ?,total_amount = ? WHERE balance_sheet_id = ?',orders, function(err, result) {
	  if(err){
		  console.log("Error occurred in OrderDAO.js updateBSheet");
		  done(err);
	  }
	  connection.release();
	  done(null, result);
	});
});
}
exports.updatePayPlan = function(payPlan,done){
	console.log("In Update Pay PLan");
	console.log(payPlan);
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in OrderDAO.js");
			return done('Database problem');
		}
	
    connection.query('INSERT INTO balance_sheet_payment (pay_date, paid_amount,balance_sheet_id,customer_id,payment_remark,balance_amount,total_amount) values (?,?,?,?,?,?,?)',payPlan, function(err, result) {
	  if(err){
		  console.log("Error occurred in OrderDAO.js updatePayPlan");
		  done(err);
	  }
	  connection.release();
	  done(null, result);
	});
});
}
exports.updateEachCanDetails = function(payPlan,done){
	console.log("In Update updateEachCanDetails ");
	console.log(payPlan);
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in OrderDAO.js");
			return done('Database problem');
		}
	
    connection.query('INSERT INTO can_received_record (can_received, received_date,can_remark,customer_id,balance_cans,total_cans,can_detail_id) values (?,?,?,?,?,?,?)',payPlan, function(err, result) {
	  if(err){
		  console.log("Error occurred in OrderDAO.js updateEachCanDetails");
		  done(err);
	  }
	  connection.release();
	  done(null, result);
	});
});
}

exports.updateTotalAmount = function(orders,done){
	console.log("In Update Bsheet");
	console.log(orders);
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in OrderDAO.js");
			return done('Database problem');
		}
		
    connection.query('UPDATE balance_sheet SET balance_amount = ?,total_amount = ? WHERE balance_sheet_id = ?',orders, function(err, result) {
	  if(err){
		  console.log("Error occurred in OrderDAO.js updateBSheet");
		  done(err);
	  }
	  connection.release();
	  done(null, result);
	});
});
}
exports.updateCanTotal = function(orders,done){
	console.log("updateCanTotal");
	console.log(orders);
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in OrderDAO.js");
			return done('Database problem');
		}
		
    connection.query('UPDATE can_details SET can_quantity = ?, can_remaining = ?,  deposit_amount = ? WHERE can_detail_id = ?',orders, function(err, result) {
	  if(err){
		  console.log("Error occurred in OrderDAO.js updateCanTotal");
		  done(err);
	  }
	  connection.release();
	  done(null, result);
	});
});
}
exports.insertBSheet = function(orders,done){
	console.log("In Insert Bsheet");
	console.log(orders);
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in OrderDAO.js");
			return done('Database problem');
		}
		
    connection.query('insert into balance_sheet (customer_id,total_amount,balance_amount) values(?,?,?)',orders, function(err, result) {
	  if(err){
		  console.log("Error occurred in OrderDAO.js insertBSheet");
		  done(err);
	  }
	  connection.release();
	  done(null, result);
	});
});	
}	
exports.insertCanDetail = function(orders,done){
	console.log("insertCanDetail");
	console.log(orders);
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in OrderDAO.js");
			return done('Database problem');
		}
		
    connection.query('insert into can_details (customer_id,can_quantity,can_remaining,can_rate,deposit_amount,can_received_date) values(?,?,?,?,?,?)',orders, function(err, result) {
	  if(err){
		  console.log("Error occurred in OrderDAO.js insertCanDetail");
		  done(err);
	  }
	  connection.release();
	  done(null, result);
	});
});	
}	

exports.getOrdersForBSheet = function(req,done){
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in OrderDAO.js")
			return done('Database problem')
		}
		
    connection.query('select * from balance_sheet as bs INNER JOIN customers as cu ON (bs.customer_id = cu.customer_id)',function(err, records){
	  if(err){
		  console.log("Error occurred in OrderDAO.js getOrders");
		  done(err);
	  }
	  connection.release();
	  done(null, records);
	});
});
}
exports.getCanDetails = function(req,done){
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in OrderDAO.js")
			return done('Database problem')
		}
		
    connection.query('select * from can_details as cd INNER JOIN customers as cu ON (cd.customer_id = cu.customer_id)',function(err, records){
	  if(err){
		  console.log("Error occurred in OrderDAO.js getCanDetails");
		  done(err);
	  }
	  connection.release();
	  done(null, records);
	});
});
}
exports.getCanDetailsForCustomer = function(id,done){
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in OrderDAO.js")
			return done('Database problem')
		}
		
    connection.query('select * from can_details as cd INNER JOIN customers as cu ON (cd.customer_id = cu.customer_id) WHERE can_detail_id = ?',id,function(err, records){
	  if(err){
		  console.log("Error occurred in OrderDAO.js getCanDetailsForCustomer");
		  done(err);
	  }
	  connection.release();
	 
	  done(null, records);
	});
});
}

exports.getOrderDetailsForBSheet = function(id,done){
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in OrderDAO.js")
			return done('Database problem')
		}
		
    connection.query('select * from balance_sheet as bs INNER JOIN customers as cu ON (bs.customer_id = cu.customer_id) WHERE balance_sheet_id = ?',id,function(err, records){
	  if(err){
		  console.log("Error occurred in OrderDAO.js getOrders");
		  done(err);
	  }
	  connection.release();
	 
	  done(null, records);
	});
});
}

exports.getPaymentDetails = function(id,done){
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in OrderDAO.js")
			return done('Database problem')
		}
		
    connection.query('select * from balance_sheet_payment WHERE balance_sheet_id = ?',id,function(err, records){
	  if(err){
		  console.log("Error occurred in OrderDAO.js getPaymentDetails");
		  done(err);
	  }
	  
	  connection.release();
	  done(null,records);
	});
});
}
exports.getEachCanRecord = function(id,done){
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in OrderDAO.js")
			return done('Database problem')
		}
		
    connection.query('select * from can_received_record WHERE can_detail_id = ?',id,function(err, records){
	  if(err){
		  console.log("Error occurred in OrderDAO.js getEachCanRecord");
		  done(err);
	  }
	  
	  connection.release();
	  done(null,records);
	});
});
}
//Ledger Tab
exports.getLedgerRecords = function(filter_data,done){
	var query;
	
	var values;
	if(filter_data.customer_id != 'none'){
		values = [filter_data.customer_id, filter_data.from_date, filter_data.to_date];
		query = 'SELECT gst,GROUP_CONCAT(om.quantity_pckg_style SEPARATOR \', \') pckg, od.order_id,DATE_FORMAT(od.created,\'%d-%m-%y\') as order_date ,GROUP_CONCAT(om.item_name SEPARATOR \', \') as materials,  pckg_cost, tran_cost, discount, grand_total,delivery_status,name FROM orders as od INNER JOIN order_menu as om on(od.order_id = om.order_id) INNER JOIN customers cr on(od.customer_id = cr.customer_id) WHERE od.customer_id = ? AND od.created >= ? AND od.created <= ? AND od.delivery_status != "Cancelled" GROUP BY od.order_id';
	}else{
		values = [ filter_data.from_date, filter_data.to_date];
		query = 'SELECT gst,GROUP_CONCAT(om.quantity_pckg_style SEPARATOR \', \') pckg, od.order_id,DATE_FORMAT(od.created,\'%d-%m-%y\') as order_date ,GROUP_CONCAT(om.item_name SEPARATOR \', \') as materials, pckg_cost, tran_cost, discount, grand_total,delivery_status,name FROM orders as od INNER JOIN order_menu as om on(od.order_id = om.order_id) INNER JOIN customers cr on(od.customer_id = cr.customer_id) WHERE od.created >= ? AND od.created <= ? AND od.delivery_status != "Cancelled" GROUP BY od.order_id';
	}
	console.log(values);
	console.log(query);
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in OrderDAO.js")
			return done('Database problem')
		}
		
		connection.query(query,values,function(err, records){
			if(err){
				console.log("Error occurred in OrderDAO.js getLedgerRecords");
				done(err);
			}
			connection.release();
			done(null, records);
			});
});
}
exports.getLedgerBSRecords = function(filter_data,done){
	var query;
	
	var values;
	if(filter_data.customer_id != 'none'){
		values = [filter_data.customer_id, filter_data.from_date, filter_data.to_date];
		query = 'SELECT pay_date,payment_remark,name,bp.total_amount btamt,bp.balance_amount as bbamt,bp.paid_amount as bpamt FROM balance_sheet_payment bp INNER JOIN balance_sheet bs ON (bp.balance_sheet_id = bs.balance_sheet_id) INNER JOIN customers cr on(bs.customer_id = cr.customer_id) where bs.customer_id = ? AND pay_date >= ? AND pay_date <= ? ORDER BY payment_id ASC ';
	}else{
		values = [ filter_data.from_date, filter_data.to_date];
		query = 'SELECT pay_date,payment_remark,name,bs.total_amount btamt,bs.balance_amount bbamt,bs.paid_amount bpamt FROM balance_sheet_payment bp INNER JOIN balance_sheet bs ON (bp.balance_sheet_id = bs.balance_sheet_id) INNER JOIN customers cr on(bs.customer_id = cr.customer_id) GROUP BY bs.balance_sheet_id HAVING( pay_date >= ? AND pay_date <= ?) ORDER BY payment_id ASC ';
	}

	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in OrderDAO.js")
			return done('Database problem')
		}
		
    connection.query(query,values,function(err, records){
	  if(err){
		  console.log("Error occurred in OrderDAO.js getLedgerBSRecords");
		  done(err);
	  }
	  connection.release();
	  done(null, records);
	});
});
}
