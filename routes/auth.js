var jwt = require('jwt-simple');
var userDAO = require('../dao/UserDAO');
var bcrypt = require('../util/BCryptUtil');

var auth = {
  login: function(req, res) {
    var username = req.body.username || '';
    var password = req.body.password || '';

    if (username == '' || password == '') {
      console.log("In here: "+req.body.username+", "+req.body.password);
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }

    // Fire a query to your DB and check if the credentials are valid
    
    userDAO.getUserOnlyPassword(username,function(err,dbPassword) {
      var response;
      if (err){
          console.log("Error Occurred In /user/login");
          console.log(err);
      }
       
        if(dbPassword != undefined && dbPassword.length > 0){
        bcrypt.comparePassword(password,dbPassword,function(err,isPassMatch){
          if (err) {
            console.log("Error Occurred In /user/login");
            console.log(err);     
            test = "";
          }
          
          if(isPassMatch){        
            console.log("In Success ");
            response = {
              status  : 200,
              statusText : "success",
              success : 'Updated Successfully',
              access_token :  genToken("dbUserObj")
          }
          
          } else{
            response = {
              status  : 200,
              statusText : "error",
              success : 'Invalid Credential'
            }         
        }
          res.end(JSON.stringify(response));
        });

      }else{
        console.log("Error Occurred In /user/login");
        console.log(err);
      }       
    
           
  }); 
    

  },

  validate: function(username, password) {
   
    userDAO.getUserOnlyPassword(username,function(err,dbPassword) {
    if (err){
        console.log("Error Occurred In /user/login");
        console.log(err);
      
    }
       
        if(dbPassword != undefined && dbPassword.length > 0){
           test =  "dbUserObj342";
        bcrypt.comparePassword(dbPassword,password,function(err,isPassMatch){
          if (err) {
            console.log("Error Occurred In /user/login");
            console.log(err);
            
            test = "";
          }
          if(isPassMatch){
            
            test =  "dbUserObj";
          } 
        });

      }else{
        console.log("Error Occurred In /user/login");
        console.log(err);
      }       
    
           
  }); 
    
  },

  validateUser: function(username) {
    console.log("1 username: "+username);
    // spoofing the DB response for simplicity
    var dbUserObj = { // spoofing a userobject from the DB. 
      name: 'admin',
      role: 'admin',
      username: 'admin'
    };

    return dbUserObj;
  },
}

// private method
function genToken(user) {
  var expires = expiresIn(1); // 7 days
  var token = jwt.encode({
    exp: expires
  }, require('../config/secret')());

  return {
    token: token,
    expires: expires,
    user: user
  };
}

function expiresIn(numDays) {
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;
