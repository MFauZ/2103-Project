var connection = require('../connection');
var Cryptr = require('cryptr');

cryptr = new Cryptr('myTotalySecretKey');

module.exports.authenticate=function(req,res){
    var email=req.body.email;
    var password=req.body.password;
   
    connection.query('SELECT * FROM user WHERE email = ?',[email], function (error, results, fields) {
      if (error) {
          res.json({
            status:false,
            message:'there are some error with query'
            })
      }else{
       
        if(results.length >0){
            decryptedString = cryptr.decrypt(results[0].password);
            if(password==decryptedString){
                //verifiedUser = results[0].username
                var verifiedUser = encodeURIComponent(cryptr.encrypt(results[0].username));
                res.redirect('/session?valid=' + verifiedUser);

            }else{
              var status = encodeURIComponent("true");
              res.redirect('/?fail=' + status);
            }
        }
        else{
          var status = encodeURIComponent("true");
          res.redirect('/?fail=' + status);
        }
      }
    });
}
