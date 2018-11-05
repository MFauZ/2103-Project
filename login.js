var path = require('path');
var express=require("express");
var session = require('express-session')
var connection = require("./controllers/config.js")
const bodyParser=require('body-parser');

var app = express();
var authenticateController=require('./controllers/authenticate-controller');
var registerController=require('./controllers/register-controller');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



var srcpath = path.resolve(__dirname);
console.log(srcpath)  

app.get('/', function (req, res) {
	res.sendFile(srcpath + "/index.html");  
})

// app.get('/admin',function(req,res){
//   ssn = req.session;
//   if(ssn.email) {
//     res.write('<h1>Hello '+ssn.email+'</h1>');
//     res.end('<a href="+">Logout</a>');
//   } else {
//     res.write('<h1>login first.</h1>');
//     res.end('<a href="+">Login</a>');
//   }
// });  
 
// app.get('/index.html', function (req, res) {  
//    res.sendFile(srcpath + "/login.html");  
// })  
 
/* route to handle login and registration */
app.post('/api/register',registerController.register);
app.post('/api/authenticate',authenticateController.authenticate);
 
console.log(authenticateController);
app.post('/controllers/register-controller', registerController.register);
app.post('/controllers/authenticate-controller', authenticateController.authenticate);
app.use(express.static(path.join(__dirname, 'public')));



app.listen(8012, (err) => {
   console.log('server started on port: '+ 8012);
});