var expenseDAO = require('../dao/ExpenseDAO');

var express = require('express');
var router = express.Router();
var passport = require('passport');


exports.addExpense = [ function(req, res) {
	var expense_data = {
		'expense_name' : req.body.expense_name,
		'date' : req.body.date,
		'id' : req.body.id,
		'amount' : req.body.amount,
		'remark' : req.body.remark,
		'expense_category' : req.body.expense_name				
	};
	expenseDAO.addExpense(expense_data, function(err, expenseData) {
		if (err){
	    	console.log("Error Occurred In ExpenseService.addExpense");
			console.log(err);
			return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
	    }
		
		var response = {
		    status  : 200,
		    statusText : "success",
		    success : 'Added Successfully'
		}
		
		res.end(JSON.stringify(response));


	});
} ]


exports.getExpense = [ function(req, res) {
	expenseDAO.getExpenseList(req, function(err, expenseData) {
		if (err){
	    	console.log("Error Occurred In expenseService.getexpense");
			console.log(err);
			return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
	    }
		
		var response = {
		    status  : 200,
		    success : 'All Expenses',
	    	expense : expenseData
		}
		
		res.end(JSON.stringify(response));


	});
} ]

exports.getExpenseDetails = [ function(req, res) {
	expenseDAO.getExpenseDetails(req.body.id, function(err, expenseData) {
		if (err){
	    	console.log("Error Occurred In expenseService.getexpenseDetails");
			console.log(err);
			return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
	    }
		
		var response = {
		    status  : 200,
		    success : 'expense',
	    	expense : expenseData
		}
		
		res.end(JSON.stringify(response));


	});
} ]

exports.getExpenseRecords = [ function(req, res) {
	var filter_data = {
		'expense_name' : req.body.expense_name,
		'from_date' : req.body.from_date,
		'to_date' : req.body.to_date			
	};
	expenseDAO.getExpenseRecords(filter_data, function(err, expenseData) {
		if (err){
	    	console.log("Error Occurred In expenseService.getExpenseRecords");
			console.log(err);
			return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
	    }
		
		var response = {
		    status  : 200,
		    success : 'expense',
	    	expense : expenseData
		}
		
		res.end(JSON.stringify(response));


	});
} ]


exports.updateExpense = [ function(req, res) {
	var expense_data = {
					'expense_name' : req.body.expense_name,
					'date' : req.body.date,
					'id' : req.body.id,
					'amount' : req.body.amount,
					'remark' : req.body.remark				
				};
	expenseDAO.updateExpense(expense_data, function(err, expenseData) {
		if (err){
	    	console.log("Error Occurred In expenseService.updateexpense");
			console.log(err);
			return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
	    }
		
		var response = {
		    status  : 200,
		    success : 'expense'
	    	
		}
		
		res.end(JSON.stringify(response));
		
		

	});
} ]


exports.getExpenseType = [ function(req, res) {
	expenseDAO.getExpenseType( function(err, expenseTypeData) {
		if (err){
	    	console.log("Error Occurred In expenseService.getExpenseType");
			console.log(err);
			return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
	    }
		
		var response = {
		    status  : 200,
		    success : 'expenseType',
	    	expenseType : expenseTypeData
		}
		
		res.end(JSON.stringify(response));


	});
} ]

exports.deleteExpense = [ function(req, res) {
	expenseDAO.deleteExpense(req.body.id, function(err, expenseData) {
		if (err){
	    	console.log("Error Occurred In expenseService.deleteExpense");
			console.log(err);
			return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
	    }
		
		var response = {
		    status  : 200,
		    success : 'expense',
	    	expense : expenseData
		}
		
		res.end(JSON.stringify(response));


	});
} ]