var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
//var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var CronJob = require('cron').CronJob;
var oauth2 = require('./oauth2')
, user = require('./user')
, util = require('util')

//adding winston for logging
var winston = require('winston'),
    expressWinston = require('express-winston');


//Facebook token


var routes = require('./routes/index');
var orderService = require('./services/OrderService');
var menuService = require('./services/MenuService');
var custService = require('./services/CustomerService');
var offerService = require('./services/OfferService');
var expenseService = require('./services/ExpenseService');

var authMod = require('./routes/auth');

var db = require('./util/DBConnection');

var jwt = require('jsonwebtoken');
var secret = 'TOPSECRETTTTT';
var app = express();
var SessionStore = session.MemoryStore;
// view engine setup
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');


//Adding winston for logging here
app.use(expressWinston.logger({
      transports: [
        new winston.transports.Console({
          json: true,
          colorize: true
        })
      ],
      meta: true, // optional: control whether you want to log the meta data about the request (default to true)
      msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
      expressFormat: true, // Use the default Express/morgan request formatting, with the same colors. Enabling this will override any msg and colorStatus if true. Will only output colors on transports with colorize set to true
      colorStatus: true, // Color the status code, using the Express/morgan color palette (default green, 3XX cyan, 4XX yellow, 5XX red). Will not be recognized if expressFormat is true
      ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
    }));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "X-ACCESS_TOKEN, Access-Control-Allow-Origin, Authorization, Origin,x-requested-with,contentType,Content-Range, Content-Disposition, Content-Description");
  next();
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(session({ 
	secret: 'SECRET',
	store: new SessionStore(),
    maxAge: 7200000 
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);


app.all('/order/*', [require('./middlewares/validateRequest')]);
app.all('/menu/*', [require('./middlewares/validateRequest')]);
app.all('/offer/*', [require('./middlewares/validateRequest')]);
app.all('/cust/*', [require('./middlewares/validateRequest')]);

//Order services
app.post('/order/addOrder', orderService.addOrder);
app.options('/order/addOrder', orderService.addOrder);
app.post('/order/getOrders', orderService.getOrders);
app.options('/order/getOrders', orderService.getOrders);
app.post('/order/getOrderDetails', orderService.getOrderDetails);
app.options('/order/getOrderDetails', orderService.getOrderDetails);
app.post('/order/getDeliveryPerson', orderService.getDeliveryPerson);
app.options('/order/getDeliveryPerson', orderService.getDeliveryPerson);
app.post('/order/updateOrder', orderService.updateOrder);
app.options('/order/updateOrder', orderService.updateOrder);
app.post('/order/getMenuForOrder', orderService.getMenuForOrder);
app.post('/order/getLedgerRecords', orderService.getLedgerRecords);
app.post('/order/getLedgerBSRecords', orderService.getLedgerBSRecords);


//Menu Service
app.post('/menu/addMenu', menuService.addMenu);
app.post('/menu/getMenu', menuService.getMenu);
app.post('/menu/getMenuDetails', menuService.getMenuDetails);
app.post('/menu/updateMenu', menuService.updateMenu);
app.post('/menu/deleteMenu', menuService.deleteMenu);

//Customer service
app.post('/cust/addCust', custService.addCustomer);
app.post('/cust/getCust', custService.getCustomer);
app.post('/cust/getCustDetails', custService.getCustDetails);
app.post('/cust/updateCust', custService.updateCust);
app.post('/cust/deleteCust', custService.deleteCust);
//Customer service
app.post('/offer/addOffer', offerService.addOffer);
app.post('/offer/getOffers', offerService.getOffers);
app.post('/offer/getOfferDetails', offerService.getOfferDetails);
app.post('/offer/updateOffer', offerService.updateOffer);

app.post('/offer/getBalanceSheet', offerService.getBalanceSheet);
app.post('/offer/getBalanceSheetDetails', offerService.getBalanceSheetDetails);
app.post('/offer/updateBSheet', offerService.updateBSheet);
app.post('/offer/getPaymentDetails', offerService.getPaymentDetails);

app.post('/cans/getCanDetails', offerService.getCanDetails);
app.post('/cans/getCanDetailsForCustomer', offerService.getCanDetailsForCustomer);
app.post('/cans/updateCanDetails', offerService.updateCanDetails);
app.post('/cans/getEachCanRecord', offerService.getEachCanRecord);


//Expense Service
app.post('/expense/addExpense', expenseService.addExpense);
app.post('/expense/getExpense', expenseService.getExpense);
app.post('/expense/getExpenseDetails', expenseService.getExpenseDetails);
app.post('/expense/getExpenseRecords', expenseService.getExpenseRecords);
app.post('/expense/updateExpense', expenseService.updateExpense);
app.post('/expense/getExpenseType', expenseService.getExpenseType);
app.post('/expense/deleteExpense', expenseService.deleteExpense);

app.post('/user/login', authMod.login);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
//mysql connector
db.connect(function(err) {
	  if (err) {
	    console.log('Unable to connect to MySQL.');
	    process.exit(1)
	  } else {
	      console.log('DB Connection established');
	  }
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}





module.exports = app;
