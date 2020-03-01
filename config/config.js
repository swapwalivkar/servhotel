var PRODUCTION_DB = 'trac'
  , TEST_DB = 'takework'
  , DEV_SHORTNER_API_KEY = 'AIzaSyBzXT6kVaCTBbidjVV7QkNGnSfMyqhx-YM'
  , PROD_SHORTNER_API_KEY = ''
module.exports = {
    "port" : 3000,
    "host" : "localhost",
    "security": {
        "tokenLife" : 86400
    },
    "emailing" : {
    	host: 'dedrelay.secureserver.net', 
    	port: 25,
        service: 'Gmail',
        auth: {
              user: '', 
              pass: '' 
        }
    },
    "dbsettings" : {
    	host: 'localhost',
        user: 'root',
        password: 'Welcome1$',
        database: TEST_DB
    },
    "mailoptions" :{
    	from : 'noreply@iotmize.com'
    },
    
    "goo_api_key" : DEV_SHORTNER_API_KEY
    
}
