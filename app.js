//Include all Node.js dependencies here
const path = require('path');
const Cryptr = require('cryptr');
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser=require('body-parser');
const db = require('./connection');
const session = require('express-session')

//Declare usage of Express.js
const app = express();
const router = express.Router();

//All express middleware usage here
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

globalusername = ""

//---------------------- All Express routes here --------------------------//

app.use(function(req, res, next){
    res.locals.user = "";
    next();
});

// //Route to render homepage
app.get('/', function (req, res){
    var loginStatus = Boolean(req.query.fail);
    if (loginStatus == true){
        res.render('index',{
            errorMessage : "You suck"
        });
    }
    else{
        res.render('index');
    }
    
});

//Route to get session ID if valid (Token is username encrypted)
app.get('/session', function (req, res) {
    var username = cryptr.decrypt(req.query.valid);
    globalusername = username;
    console.log("User currently logged in:" + username)
    console.log("Global:" + globalusername)
    res.render('map',{
        user : username
    });
});

app.get('/test', function (req, res) {
    res.send("Hello");
    console.log("Global:" + globalusername);
});

//Route to render homepage
app.get('/logout', function (req, res) {
    res.sendFile(path.join(__dirname+"/index.html"));
});

//Route for login and registration
var authenticateController=require(__dirname + "/controllers/authenticate-controller");
var registerController=require(__dirname + "/controllers/register-controller");

app.post('/api/register',registerController.register);
app.post('/api/authenticate',authenticateController.authenticate);
app.post('/controllers/register-controller', registerController.register);
app.post('/controllers/authenticate-controller', authenticateController.authenticate);












// With new DB queries
// Getting all the lat lngs
//#List Residential with District
app.get('/residentialWithDistrict', (req, res) => {
    let sql = 
    'SELECT latitude, longitude FROM location' +
    ' WHERE id IN' +
    ' (' +
    ' SELECT r.lid' +
    ' FROM Residential r, Locale_postal lp, Locale_area la' +
    ' WHERE SUBSTR(postal_code, 1,2) = lp.postal_sector' +
    ' AND la.id = lp.id' +
    ' )' ;
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        console.log(results);
        res.send(results);
    });
});


//#List Residential with District Search 

// locale.toString().replace(/%20/g, " ");
app.get('/residentialWithDistrictSearch/:locale', (req, res) => {
    var locale = req.params.locale;
    let sql = 
    'SELECT latitude, longitude FROM location' +
    ' WHERE id IN' +
    ' (' + 
    ' SELECT r.lid' +
    ' FROM Residential r, Locale_postal lp, Locale_area la' +
    ' WHERE SUBSTR(postal_code, 1,2) = lp.postal_sector' +
    ' AND la.locale_name LIKE "%' + locale + '%"' +
    ' AND la.id = lp.id' +
    ' );' ;
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        console.log(results);
        res.send(results);
    });
});


app.listen('3000', () => {
    console.log('Server running on Port 3000');
});