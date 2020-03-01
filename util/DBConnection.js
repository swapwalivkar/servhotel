
var mysql = require('mysql')
  , async = require('async')
  , config = require( '../config/config.js' )

var PRODUCTION_DB = 'trac'
  , TEST_DB = 'takework'

exports.MODE_TEST = 'mode_test'
exports.MODE_PRODUCTION = 'mode_production'

var state = {
  pool: null,
  mode: null,
}

exports.connect = function(done) {
  state.pool = mysql.createPool({
	connectionLimit : 100,
    host: config.dbsettings.host,
    user: config.dbsettings.user,
    password: config.dbsettings.password,
    database: config.dbsettings.database
  })

  state.mode = "write"
  done()
}


exports.get = function(done) {
	var pool = state.pool
	if (!pool) return done(new Error('Missing database connection.'))
    state.pool.getConnection(function (err, connection) {
      if (err){
    	  console.log("Error occurred in DBCOnnection.js get");
    	  return done(err)
      }
      done(null, connection)
    })
	  
}
