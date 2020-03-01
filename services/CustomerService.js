var customerDAO = require('../dao/CustomerDAO');

var express = require('express');
var router = express.Router();
var passport = require('passport');


exports.addCustomer = [ function(req, res) {
	var cust_data = {
					'cust_name' : req.body.cust_name,
					'cust_add' : req.body.cust_add,
					'cust_contact' : req.body.cust_contact,
					'cust_email' : req.body.cust_email
					
				};
	customerDAO.addCustomer(cust_data, function(err, menuData) {
		if (err){
	    	console.log("Error Occurred In customerService.addCustomer");
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


exports.getCustomer = [ function(req, res) {
	customerDAO.getCustList(req, function(err, custData) {
		if (err){
	    	console.log("Error Occurred In customerService.getCustomer");
			console.log(err);
			return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
	    }
        console.log("Cust Data");
        console.log(custData);
		var response = {
		    status  : 200,
		    success : 'All Customers',
	    	customers : custData
		}
		
		res.end(JSON.stringify(response));


	});
} ]

exports.getCustDetails = [ function(req, res) {
	customerDAO.getCustDetails(req.body.id, function(err, custData) {
		if (err){
	    	console.log("Error Occurred In CustomerService.getCustDetails");
			console.log(err);
			return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
	    }
		
		var response = {
		    status  : 200,
		    success : 'Customer',
	    	cust : custData
		}
		
		res.end(JSON.stringify(response));


	});
} ]



exports.updateCust = [ function(req, res) {
	var cust_data = {
					'name' : req.body.cust_name,
					'address' : req.body.cust_add,
					'contact' : req.body.cust_contact,
                    'email' : req.body.cust_email,
                    'id' : req.body.id				
				};
	customerDAO.updateCust(cust_data, function(err, custData) {
		if (err){
	    	console.log("Error Occurred In CustomerService.updateCust");
			console.log(err);
			return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
	    }
		
		var response = {
		    status  : 200,
		    success : 'Customer'
	    	
		}
		
		res.end(JSON.stringify(response));
		
		

	});
} ]

exports.deleteCust = [ function(req, res) {
	customerDAO.deleteCust(req.body.id, function(err, expenseData) {
		if (err){
	    	console.log("Error Occurred In expenseService.deleteCust");
			console.log(err);
			return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
	    }
		
		var response = {
		    status  : 200,
		    success : 'cust',
	    	cust : expenseData
		}
		
		res.end(JSON.stringify(response));


	});
} ]