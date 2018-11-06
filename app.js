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

////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// -Login Modal -//////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// -Housing Modal -////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

//Route for housing for POST request from the form
app.post('/housing', (req, res) => {
  const housingResults = {
    locale: req.body.locale,
    year: req.body.year,
    room: req.body.roomtype
  }
  res.send(housingResults)
});

//Route for housing for GET request to use on the SQL query
app.get('/housing', (req, res) => {
    var locale = req.query.locale;
    var year = req.query.year;
    //var room = req.query.room;
    var room = '("' + req.query.room + '")';

    console.log("Locale:"+locale," Year:"+year," Room:"+room);    

    let housingQuery = 'SELECT latitude,longitude FROM location WHERE id IN (SELECT R.lid FROM Residential R, Locale_postal LP, Locale_area LA WHERE SUBSTR (postal_code,1,2) = LP.postal_sector AND LA.locale_name LIKE "%' + locale + '%" AND LA.id = LP.id);';

    // let housingQuery = 'SELECT latitude,longitude FROM location WHERE id IN (SELECT R.lid FROM Residential R, Locale_postal LP, Locale_area LA, room RM, resid_room RR WHERE SUBSTR (R.postal_code,1,2) = LP.postal_sector AND LA.locale_name LIKE "%' + locale + '%" AND LA.id = LP.id AND R.postal_code = RR.postal_code AND RR.room_id = RM.id AND RM.room_type IN (' + room + '));';

    let query = db.query(housingQuery,(err,results) => {
        if (err) throw err;
        res.send(results);
    })
});

////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// -Amenities Modal -//////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

//Route for primary school for POST request from the amenities parameters
app.post('/primarysch', (req, res) => {
  const primaryschResults = {
    test : req.body.test
  }
  res.send(primaryschResults)
});

//Route for primary school for GET request to use on the SQL query
app.get('/primarysch', (req, res) => {
    var testget = req.query.testget;

    let primaryQuery = 'SELECT * FROM school WHERE level = "primary"';   
    // let primaryQuery = "SET @orig_latitude = 1.376551, @orig_longitude = 103.737080, @radius = 1; SELECT l.* , sh.* , s.* FROM (SELECT id, latitude, longitude, stid , 3956 * ACOS(COS(RADIANS(@orig_latitude)) * COS(RADIANS(`latitude`)) * COS(RADIANS(@orig_longitude) - RADIANS(`longitude`)) + SIN(RADIANS(@orig_latitude)) * SIN(RADIANS(`latitude`))) AS `distance`FROM location WHERE`latitude` BETWEEN @orig_latitude - (@radius / 69) AND @orig_latitude + (@radius / 69) AND `longitude` BETWEEN @orig_longitude - (@radius / (69 * COS(RADIANS(@orig_latitude)))) AND @orig_longitude + (@radius / (69* COS(RADIANS(@orig_latitude))))) l, School sh, Street s WHERE `distance` < @radius AND sh.lid = l.id AND l.stid = s.id ORDER BY `distance` ASC;";

    let query = db.query(primaryQuery,(err,results) => {
        if (err) throw err;
        res.send(results);
    })
});

//Route for secondary school for POST request from the amenities parameters
app.post('/secondarysch', (req, res) => {
  const secondaryschResults = {
    test : req.body.test
  }
  res.send(secondaryschResults)
});

//Route for primary school for GET request to use on the SQL query
app.get('/secondarysch', (req, res) => {
    var testget = req.query.testget;

    let secondaryQuery = 'SELECT * FROM school WHERE level = "secondary"';   

    let query = db.query(secondaryQuery,(err,results) => {
        if (err) throw err;
        res.send(results);
    })
});

//Route for combined school for POST request from the amenities parameters
app.post('/combinedsch', (req, res) => {
  const combinedschResults = {
    test : req.body.test
  }
  res.send(combinedschResults)
});

//Route for combined school for GET request to use on the SQL query
app.get('/combinedsch', (req, res) => {
    var testget = req.query.testget;

    let combinedQuery = 'SELECT * FROM school WHERE level <> "primary" AND level <> "secondary"';   
    let query = db.query(combinedQuery,(err,results) => {
        if (err) throw err;
        res.send(results);
    })
});

//Route for bus stops for POST request from the amenities parameters
app.post('/busstops', (req, res) => {
  const busstopsResults = {
    test : req.body.test
  }
  res.send(busstopsResults)
});

//Route for bus stops for GET request to use on the SQL query
app.get('/busstops', (req, res) => {
    var testget = req.query.testget;

    let busstopsQuery = 'SELECT * FROM bus_stop';   
    let query = db.query(busstopsQuery,(err,results) => {
        if (err) throw err;
        res.send(results);
    })
});

//Route for mrt stations for POST request from the amenities parameters
app.post('/mrtstations', (req, res) => {
  const mrtstationsResults = {
    test : req.body.test
  }
  res.send(mrtstationsResults)
});

//Route for mrt stations for GET request to use on the SQL query
app.get('/mrtstations', (req, res) => {
    var testget = req.query.testget;

    let mrtstationsQuery = 'SELECT * FROM bus_stop';   
    let query = db.query(mrtstationsQuery,(err,results) => {
        if (err) throw err;
        res.send(results);
    })
});

//Route for NPC for POST request from the amenities parameters
app.post('/npc', (req, res) => {
  const npcResults = {
    test : req.body.test
  }
  res.send(npcResults)
});

//Route for NPC for GET request to use on the SQL query
app.get('/npc', (req, res) => {
    var testget = req.query.testget;

    let npcQuery = 'SELECT * FROM npc';   
    let query = db.query(npcQuery,(err,results) => {
        if (err) throw err;
        res.send(results);
    })
});

//Route for NPP for POST request from the amenities parameters
app.post('/npp', (req, res) => {
  const nppResults = {
    test : req.body.test
  }
  res.send(nppResults)
});

//Route for NPP for GET request to use on the SQL query
app.get('/npp', (req, res) => {
    var testget = req.query.testget;

    let nppQuery = 'SELECT * FROM npc';   
    let query = db.query(nppQuery,(err,results) => {
        if (err) throw err;
        res.send(results);
    })
});

//Route for hawker for POST request from the amenities parameters
app.post('/hawker', (req, res) => {
  const hawkerResults = {
    test : req.body.test
  }
  res.send(hawkerResults)
});

//Route for hawker for GET request to use on the SQL query
app.get('/hawker', (req, res) => {
    var testget = req.query.testget;

    let hawkerQuery = 'SELECT * FROM hawker_centre';   
    let query = db.query(hawkerQuery,(err,results) => {
        if (err) throw err;
        res.send(results);
    })
});





// Defne which port to run local server
app.listen('3000', () => {
    console.log('Server running on Port 3000');
});