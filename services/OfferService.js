var offerDAO = require('../dao/OfferDAO');
var orderDAO = require('../dao/OrderDAO');

var express = require('express');
var router = express.Router();
var passport = require('passport');


exports.addOffer = [ function(req, res) {
	var offer_data = {
		'customer_id' : req.body.customer_id,
		'product_id' : req.body.product_id,
		'product_price' : req.body.offer_price
	};
	var get_offer_data = {
		'customer_id' : req.body.customer_id,
		'product_id' : req.body.product_id
	};	
			
	offerDAO.getOfferDetails(get_offer_data, function(err, getOfferData) {
		
		if (err){
			console.log("Error Occurred In offerService.addoffer getOfferDetails");
			console.log(err);
			return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
		}
			
		if(getOfferData != undefined && getOfferData.length > 0 && getOfferData[0].customer_id == req.body.customer_id && getOfferData[0].product_id == req.body.product_id){
			console.log('In Update');
			offerDAO.updateOffer(offer_data, function(err, offerData) {
				if (err){
					console.log("Error Occurred In offerService.updateOffer");
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
		
		}else{
			offerDAO.addOffer(offer_data, function(err, offerData) {
				if (err){
					console.log("Error Occurred In offerService.addoffer");
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
		
		}
		
		
	});         
	
} ]


exports.getOffers = [ function(req, res) {
	offerDAO.getOfferList(req, function(err, offerData) {
		if (err){
	    	console.log("Error Occurred In offerService.getoffer");
			console.log(err);
			return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
	    }
		
		var response = {
		    status  : 200,
		    success : 'All Offers',
	    	offer : offerData
		}
		
		res.end(JSON.stringify(response));


	});
} ]

exports.getOfferDetails = [ function(req, res) {
	var offer = {'customer_id':req.body.customer_id,'product_id':req.body.product_id}
	console.log(offer);
	offerDAO.getOfferDetails(offer, function(err, offerData) {
		if (err){
	    	console.log("Error Occurred In offerService.getofferDetails");
			console.log(err);
			return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
		
		}
		
		var response = {
		    status  : 200,
		    success : 'offer',
	    	offer : offerData
		}
		
		res.end(JSON.stringify(response));


	});
} ]



exports.updateOffer = [ function(req, res) {
	var offer_data = {
					'customer_id' : req.body.customer_id,
					'product_id' : req.body.product_id,
					'product_price' : req.body.offer_price				
				};
	offerDAO.updateOffer(offer_data, function(err, offerData) {
		if (err){
	    	console.log("Error Occurred In offerService.updateoffer");
			console.log(err);
			return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
	    }
		
		var response = {
		    status  : 200,
		    success : 'offer'
	    	
		}
		
		res.end(JSON.stringify(response));
		
		

	});
} ]

exports.getCanDetails = [ function(req, res) {
	orderDAO.getCanDetails(req, function(err, orderData) {
		if (err){
	    	console.log("Error Occurred In offerService.getCanDetails");
			console.log(err);
			return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
	    }
		
		var response = {
		    status  : 200,
		    success : 'All Orders',
	    	canRec : orderData
		}
		
		res.end(JSON.stringify(response));

	});
} ]
exports.getCanDetailsForCustomer = [ function(req, res) {
	orderDAO.getCanDetailsForCustomer(req.body.id, function(err, orderData) {
		if (err){
	    	console.log("Error Occurred In offerService.getCanDetailsForCustomer");
			console.log(err);
			return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
	    }
		
		var response = {
		    status  : 200,
		    success : 'Can Record',
	    	canRec : orderData
		}
		
		res.end(JSON.stringify(response));

	});
} ]

exports.getBalanceSheet = [ function(req, res) {
	orderDAO.getOrdersForBSheet(req, function(err, orderData) {
		if (err){
	    	console.log("Error Occurred In offerService.getBalanceSheet");
			console.log(err);
			return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
	    }
		
		var response = {
		    status  : 200,
		    success : 'All Orders',
	    	bsheet : orderData
		}
		
		res.end(JSON.stringify(response));

	});
} ]

exports.getBalanceSheetDetails = [ function(req, res) {
	orderDAO.getOrderDetailsForBSheet(req.body.id, function(err, orderData) {
		if (err){
	    	console.log("Error Occurred In offerService.getBalanceSheet");
			console.log(err);
			return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
	    }
		
		var response = {
		    status  : 200,
		    success : 'Balance Sheet Record',
	    	bsheet : orderData
		}
		
		res.end(JSON.stringify(response));

	});
} ]
exports.getPaymentDetails = [ function(req, res) {
	orderDAO.getPaymentDetails(req.body.id, function(err, orderData) {
		if (err){
	    	console.log("Error Occurred In offerService.getPaymentDetails");
			console.log(err);
			return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
	    }
		
		var response = {
		    status  : 200,
		    success : 'Balance Sheet Record',
	    	payDetails : orderData
		}
		
		res.end(JSON.stringify(response));

	});
} ]
exports.getEachCanRecord = [ function(req, res) {
	orderDAO.getEachCanRecord(req.body.id, function(err, canData) {
		if (err){
	    	console.log("Error Occurred In offerService.getEachCanRecord");
			console.log(err);
			return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
	    }
		
		var response = {
		    status  : 200,
		    success : 'Can Record',
	    	canRecData : canData
		}
		
		res.end(JSON.stringify(response));

	});
} ]

exports.updateBSheet = [ function(req, res) {
	var order_data = {
					'paid_amount' : req.body.paid_amount,
					'balance_amount' : req.body.bal_amount,
					'balance_sheet_id' : req.body.id
                };
	var updateValues =  [req.body.paid_amount,req.body.bal_amount, req.body.total_amount,order_data.balance_sheet_id];
	var payPlanValues =  [req.body.pay_date,req.body.amt_paid,order_data.balance_sheet_id,req.body.customer_id,req.body.payment_remark,req.body.bal_amount, req.body.total_amount];
	console.log(payPlanValues);
	orderDAO.updateBSheet(updateValues, function(err, orderData) {
		if (err){
	    	console.log("Error Occurred In orderService.updateBSheet");
			console.log(err);
			return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
	    }
		orderDAO.updatePayPlan(payPlanValues, function(err, orderData) {
			if (err){
				console.log("Error Occurred In orderService.updatePayPlan");
				console.log(err);
				return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
			}
		});
		var response = {
		    status  : 200,
		    success : 'Order'
		}
		res.end(JSON.stringify(response));

	});
} ]

exports.updateCanDetails = [ function(req, res) {
	var can_data = {
					'deposit_amount' : req.body.deposit_amount,
					'can_quantity' : req.body.can_quantity,
					'can_remaining' : req.body.can_remaining,
					'can_received' : req.body.can_received,
					'can_detail_id' : req.body.id
                };
	var updateValues =  [req.body.deposit_amount,req.body.can_quantity, req.body.can_remaining,req.body.can_received,req.body.received_date,req.body.id];
	var updateEachCan =  [req.body.can_rec,req.body.received_date,req.body.can_remark,req.body.customer_id,req.body.can_remaining,req.body.can_quantity,req.body.id];
	
	orderDAO.updateCanDetails(updateValues, function(err, orderData) {
		if (err){
	    	console.log("Error Occurred In orderService.updateCanDetails");
			console.log(err);
			return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
	    }
		orderDAO.updateEachCanDetails(updateEachCan, function(err, orderData) {
			if (err){
				console.log("Error Occurred In orderService.updatePayPlan");
				console.log(err);
				return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
			}
		});
		var response = {
		    status  : 200,
		    success : 'Order'
		}
		res.end(JSON.stringify(response));

	});
} ]