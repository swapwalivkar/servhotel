var menuDAO = require('../dao/MenuDAO');

var express = require('express');
var router = express.Router();
var passport = require('passport');


exports.addMenu = [ function(req, res) {
	var menu_data = {
					'menu_cat' : req.body.menu_cat,
					'menu_name' : req.body.menu_name,
					'menu_price' : req.body.menu_price,
					'prod_pckg_style' : req.body.prod_pckg_style
				};
	menuDAO.addMenu(menu_data, function(err, menuData) {
		if (err){
	    	console.log("Error Occurred In menuService.addMenu");
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


exports.getMenu = [ function(req, res) {
	menuDAO.getMenuList(req, function(err, menuData) {
		if (err){
	    	console.log("Error Occurred In menuService.getMenu");
			console.log(err);
			return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
	    }
		
		var response = {
		    status  : 200,
		    success : 'All Products',
	    	menu : menuData
		}
		
		res.end(JSON.stringify(response));


	});
} ]

exports.getMenuDetails = [ function(req, res) {
	menuDAO.getMenuDetails(req.body.id, function(err, menuData) {
		if (err){
	    	console.log("Error Occurred In MenuService.getMenuDetails");
			console.log(err);
			return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
	    }
		
		var response = {
		    status  : 200,
		    success : 'Menu',
	    	menu : menuData
		}
		
		res.end(JSON.stringify(response));


	});
} ]



exports.updateMenu = [ function(req, res) {
	var menu_data = {
					'menu_cat' : req.body.menu_cat,
					'menu_name' : req.body.menu_name,
					'id' : req.body.id,
					'menu_price' : req.body.menu_price,
					'prod_pckg_style' : req.body.prod_pckg_style				
				};
	menuDAO.updateMenu(menu_data, function(err, menuData) {
		if (err){
	    	console.log("Error Occurred In MenuService.updateMenu");
			console.log(err);
			return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
	    }
		
		var response = {
		    status  : 200,
		    success : 'Menu'
	    	
		}
		
		res.end(JSON.stringify(response));
		
		

	});
} ]

exports.deleteMenu = [ function(req, res) {
	menuDAO.deleteMenu(req.body.id, function(err, menuData) {
		if (err){
	    	console.log("Error Occurred In menuService.deleteMenu");
			console.log(err);
			return res.end(res.writeHead(500, err, {'content-type' : 'text/plain'}));
	    }
		
		var response = {
		    status  : 200,
		    success : 'menu',
	    	menu : menuData
		}
		
		res.end(JSON.stringify(response));


	});
} ]