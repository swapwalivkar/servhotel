var orderDAO = require('../dao/OrderDAO');

var express = require('express');
var router = express.Router();
var passport = require('passport');




exports.addOrder = [ function(req, res) {
	
	var order_data = {
					'customer_id' : req.body.customer_id,
					'total_amount' : req.body.total_amount,
					'balance_amount' : req.body.total_amount,
					'menu_items' : req.body.menu_items,
					'tran_cost' : req.body.tran_cost,
					'pckg_cost' : req.body.pckg_cost,
					'discount' : req.body.discount,
					'grand_total' : req.body.grand_total,
					'gst' : req.body.gst,
					'order_date' : req.body.order_date,
					'can_quantity' : req.body.can_quantity,
					'can_rate' : req.body.can_rate
				};
	
	orderDAO.addOrder(order_data, function(err, orderData) {
		if (err){
	    	console.log("Error Occurred In orderService.addOrder");
			console.log(err);
			return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
	    }
		
		var response = {
		    status  : 200,
		    statusText : "success",
		    success : 'Updated Successfully'
		}
		
		res.end(JSON.stringify(response));


	});
} ]


exports.getOrders = [ function(req, res) {
	orderDAO.getOrders(req, function(err, orderData) {
		if (err){
	    	console.log("Error Occurred In orderService.getOrders");
			console.log(err);
			return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
	    }
		
		var response = {
		    status  : 200,
		    success : 'All Orders',
	    	orders : orderData
		}
		
		res.end(JSON.stringify(response));


	});
} ]

exports.getOrderDetails = [ function(req, res) {
	console.log(req.body);
	orderDAO.getOrderDetails(req.body.id, function(err, orderData) {
		if (err){
	    	console.log("Error Occurred In orderService.getOrderDetails");
			console.log(err);
			return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
	    }
		
		var response = {
		    status  : 200,
		    success : 'Order',
	    	orders : orderData
		}
		
		res.end(JSON.stringify(response));


	});
} ]
exports.getMenuForOrder = [ function(req, res) {
	orderDAO.getMenuForOrder(req.body.id, function(err, itemsData) {
		if (err){
	    	console.log("Error Occurred In orderService.getOrderDetails");
			console.log(err);
			return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
	    }
		
		var response = {
		    status  : 200,
		    success : 'Order',
	    	items : itemsData
		}
		
		res.end(JSON.stringify(response));


	});
} ]
exports.getDeliveryPerson = [ function(req, res) {
	console.log(req.body);
	orderDAO.getDeliveryPerson(req.body.company, function(err, orderData) {
		if (err){
	    	console.log("Error Occurred In orderService.getDeliveryPerson");
			console.log(err);
			return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
	    }
		
		var response = {
		    status  : 200,
		    success : 'Order',
	    	persons : orderData
		}
		
		res.end(JSON.stringify(response));


	});
} ]

exports.updateOrder = [ function(req, res) {
	var order_data = {
					'delivery_status' : req.body.delivery_status,
					'assigned_to' : req.body.assigned_to,
					'order_date' : req.body.order_date,
					'order_id' : req.body.order_id,
					'grand_total' : req.body.grand_total,
					'customer_id' : req.body.customer_id
				};
	orderDAO.updateOrder(order_data, function(err, orderData) {
		if (err){
	    	console.log("Error Occurred In orderService.updateOrder");
			console.log(err);
			return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
	    }
		
		var response = {
		    status  : 200,
		    success : 'Order'
	    	
		}
		
		res.end(JSON.stringify(response));

	});
} ]

exports.getLedgerRecords = [ function(req, res) {
	console.log('Hello : '+req.body.customer_id);
	var filter_data = {
		'customer_id' : req.body.customer_id,
		'from_date' : req.body.from_date,
		'to_date' : req.body.to_date
	};
	
	orderDAO.getLedgerRecords(filter_data, function(err, ledgerData) {
		if (err){
	    	console.log("Error Occurred In orderService.getLedgerRecords");
			console.log(err);
			return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
	    }
		console.log(ledgerData);
		var response = {
		    status  : 200,
		    success : 'Ledger Records',
	    	ledgerData : ledgerData
		}
		
		res.end(JSON.stringify(response));

	});
} ]

exports.getLedgerBSRecords = [ function(req, res) {
	var filter_data = {
					'customer_id' : req.body.customer_id,
					'from_date' : req.body.from_date,
					'to_date' : req.body.to_date
				};
	orderDAO.getLedgerBSRecords(filter_data, function(err, ledgerBSData) {
		if (err){
	    	console.log("Error Occurred In orderService.getLedgerRecords");
			console.log(err);
			return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
	    }
		
		var response = {
		    status  : 200,
		    success : 'Ledger BS Records',
	    	ledgerBSData : ledgerBSData
		}
		
		res.end(JSON.stringify(response));

	});
} ]