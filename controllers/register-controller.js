var Cryptr = require('cryptr');
var express=require("express");
var connection = require('../connection');
 
module.exports.register=function(req,res){
    var today = new Date();
    var encryptedString = cryptr.encrypt(req.body.password);
    var users={
        "username":req.body.username,
        "email":req.body.email,
        "password":encryptedString,
        "created_at":today
    }
    connection.query('INSERT INTO user SET ?',users, function (error, results, fields) {
      if (error) {
        res.json({
            status:false,
            message: error
        })
      }else{
          res.json({
            status:true,
            data:results,
            message:'user registered sucessfully'
        })
      }
    });
}
