var dbConn = require('../util/DBConnection');

exports.addExpense = function(data,done){
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in ExpenseDAO.js")
			return done('Database problem')
		}
		if(data.expense_category && data.expense_category != ''){
			var values = [data.expense_category]
			console.log(values);  	
			connection.query('INSERT INTO expense_type (expense_name) VALUES(?)', values, function(err, result) {
				if (err){
					console.log("Error occurred in ExpenseDAO.js addExpense")
					return done(err);
				}
				console.log("Expense type added Successfully");
			});	
		}
    var values = [data.expense_name, data.date, data.amount, data.remark]
	  console.log(values);  	
    connection.query('INSERT INTO expenses (expense_name, date, amount, remark) VALUES(?, ?, ?, ?)', values, function(err, result) {
      if (err){
    	  console.log("Error occurred in ExpenseDAO.js addExpense")
    	  return done(err);
      }
      connection.release();
			console.log("Expense added Successfully");
			
      done(null, result.insertId)
		});
		
		
});
}

exports.getExpenseList = function(req,done){
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in ExpenseDAO.js")
			return done('Database problem')
		}
		
    connection.query('SELECT *,DATE_FORMAT(date,\'%d-%m-%y\') as edate FROM expenses',function(err, records){
	  if(err){
		  console.log("Error occurred in ExpenseDAO.js getExpenseList");
		  done(err);
	  }
	  connection.release();
	  done(null, records);
	});
});
}

exports.getExpenseDetails = function(id,done){
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in ExpenseDAO.js")
			return done('Database problem')
		}
		
    connection.query('SELECT * FROM expenses where expense_id = ?',id,function(err, records){
	  if(err){
		  console.log("Error occurred in ExpenseDAO.js getExpenseDetails");
		  done(err);
	  }
	  connection.release();
	  done(null, records);
	});
});
}
exports.getExpenseRecords = function(filter_data,done){
	var query = '';
	var values = [];
	if(filter_data.expense_name == 'none'){
		query = 'SELECT *,DATE_FORMAT(date,\'%d-%m-%y\') as edate FROM expenses where date >= ? AND date <= ?';
		values = [filter_data.from_date, filter_data.to_date]
	}else{
		query = 'SELECT *,DATE_FORMAT(date,\'%d-%m-%y\') as edate FROM expenses where expense_name = ? AND date >= ? AND date <= ?';
		values = [filter_data.expense_name, filter_data.from_date, filter_data.to_date]
	}
		
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in ExpenseDAO.js")
			return done('Database problem')
		}
		
    connection.query(query,values,function(err, records){
	  if(err){
		  console.log("Error occurred in ExpenseDAO.js getExpenseRecords");
		  done(err);
	  }
	  connection.release();
	  done(null, records);
	});
});
}

exports.updateExpense = function(expense,done){
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in ExpenseDAO.js")
			return done('Database problem')
		}
		
    connection.query('UPDATE expenses SET expense_name = ?,date = ?,amount = ? ,remark = ? WHERE expense_id = ?',
    		[expense.expense_name, expense.date,expense.amount, expense.remark, expense.id], function(err, result) {
	  if(err){
		  console.log("Error occurred in ExpenseDAO.js updateExpense");
		  done(err);
	  }
	  connection.release();
	  done(null, result);
	});
});
	
}	

exports.getExpenseType = function(done){
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in ExpenseDAO.js")
			return done('Database problem')
		}
		
    connection.query('SELECT * FROM expense_type',function(err, records){
	  if(err){
		  console.log("Error occurred in ExpenseDAO.js getExpenseType");
		  done(err);
	  }
	  connection.release();
	  done(null, records);
	});
});
}
exports.deleteExpense = function(id,done){
	dbConn.get(function(err, connection) {
		if (err){
			console.log("Error occurred in ExpenseDAO.js")
			return done('Database problem')
		}
		
    connection.query('DELETE FROM expenses where expense_id = ?',id,function(err, records){
	  if(err){
		  console.log("Error occurred in ExpenseDAO.js deleteExpense");
		  done(err);
	  }
	  connection.release();
	  done(null, records);
	});
});
}
