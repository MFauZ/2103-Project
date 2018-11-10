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
  res.send(housingResults);
});

//Route for housing for GET request to use on the SQL query
app.get('/housing', (req, res) => {
    var locale = req.query.locale;
    var year = req.query.year;
    var syear = year.split("-")[0];
    var eyear = year.split("-")[1]
    var room = String(req.query.room);

    room = "(" + room + ")";

    let housingQuery = "SELECT Distinct longitude, latitude, block, year, floors FROM group8.housing WHERE  locale_name LIKE " + "'%" + locale + "%'" + " AND year > "+ syear +" AND year < "+ eyear +" AND room_id in "+room+";";

    let query = db.query(housingQuery,(err,results) => {
        if (err) throw err;
        res.send(results);
    });
});

////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// -Amenities Modal -//////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

//Route for primary school for GET request to use on the SQL query
app.get('/primarysch', (req, res) => {
    var proximity = req.query.proximity;
    var latitude = req.query.latitude;
    var longitude = req.query.longitude;

    // let primaryQuery = 'SELECT * FROM school WHERE level = "primary"';   
    let primaryQuery = "SELECT l.* , sh.* , s.* FROM (SELECT id, latitude, longitude, stid , 3956 * ACOS(COS(RADIANS("+latitude+")) * COS(RADIANS(`latitude`)) * COS(RADIANS("+longitude+") - RADIANS(`longitude`)) + SIN(RADIANS("+latitude+")) * SIN(RADIANS(`latitude`))) AS `distance`FROM location WHERE`latitude` BETWEEN "+latitude+" - ("+proximity+"/69) AND "+latitude+" + ("+proximity+"/69) AND `longitude` BETWEEN "+longitude+" - ("+proximity+"/(69 * COS(RADIANS("+latitude+")))) AND "+longitude+" + (1"+proximity+"/(69* COS(RADIANS("+latitude+"))))) l, School sh, Street s WHERE sh.level = 'primary' AND `distance` <"+proximity+" AND sh.lid = l.id AND l.stid = s.id ORDER BY `distance` ASC;";

    let query = db.query(primaryQuery,(err,results) => {
        if (err) throw err;
        res.send(results);
    });
});

//Route for primary school for GET request to use on the SQL query
app.get('/secondarysch', (req, res) => {
    var proximity = req.query.proximity;
    var latitude = req.query.latitude;
    var longitude = req.query.longitude;

    let secondaryQuery = "SELECT l.* , sh.* , s.* FROM (SELECT id, latitude, longitude, stid , 3956 * ACOS(COS(RADIANS("+latitude+")) * COS(RADIANS(`latitude`)) * COS(RADIANS("+longitude+") - RADIANS(`longitude`)) + SIN(RADIANS("+latitude+")) * SIN(RADIANS(`latitude`))) AS `distance`FROM location WHERE`latitude` BETWEEN "+latitude+" - ("+proximity+"/69) AND "+latitude+" + ("+proximity+"/69) AND `longitude` BETWEEN "+longitude+" - ("+proximity+"/(69 * COS(RADIANS("+latitude+")))) AND "+longitude+" + (1"+proximity+"/(69* COS(RADIANS("+latitude+"))))) l, School sh, Street s WHERE sh.level = 'secondary' AND `distance` <"+proximity+" AND sh.lid = l.id AND l.stid = s.id ORDER BY `distance` ASC;"; 

    let query = db.query(secondaryQuery,(err,results) => {
        if (err) throw err;
        res.send(results);
    });
});

//Route for combined school for GET request to use on the SQL query
app.get('/combinedsch', (req, res) => {
    var proximity = req.query.proximity;
    var latitude = req.query.latitude;
    var longitude = req.query.longitude;

    console.log(proximity,latitude,longitude);

    let combinedQuery = "SELECT l.* , sh.* , s.* FROM (SELECT id, latitude, longitude, stid , 3956 * ACOS(COS(RADIANS("+latitude+")) * COS(RADIANS(`latitude`)) * COS(RADIANS("+longitude+") - RADIANS(`longitude`)) + SIN(RADIANS("+latitude+")) * SIN(RADIANS(`latitude`))) AS `distance`FROM location WHERE`latitude` BETWEEN "+latitude+" - ("+proximity+"/69) AND "+latitude+" + ("+proximity+"/69) AND `longitude` BETWEEN "+longitude+" - ("+proximity+"/(69 * COS(RADIANS("+latitude+")))) AND "+longitude+" + (1"+proximity+"/(69* COS(RADIANS("+latitude+"))))) l, School sh, Street s WHERE sh.level <> 'primary' AND sh.level <> 'secondary'  AND `distance` <"+proximity+" AND sh.lid = l.id AND l.stid = s.id ORDER BY `distance` ASC;"; 

    let query = db.query(combinedQuery,(err,results) => {
        if (err) throw err;
        res.send(results);
    });
});

//Route for bus stops for GET request to use on the SQL query
app.get('/busstops', (req, res) => {
    var proximity = req.query.proximity;
    var latitude = req.query.latitude;
    var longitude = req.query.longitude;

    console.log(proximity,latitude,longitude);

    let busQuery = "SELECT l.* , b.* , s.* FROM (SELECT id, latitude, longitude, stid , 3956 * ACOS(COS(RADIANS("+latitude+")) * COS(RADIANS(`latitude`)) * COS(RADIANS("+longitude+") - RADIANS(`longitude`)) + SIN(RADIANS("+latitude+")) * SIN(RADIANS(`latitude`))) AS `distance`FROM location WHERE`latitude` BETWEEN "+latitude+" - ("+proximity+"/69) AND "+latitude+" + ("+proximity+"/69) AND `longitude` BETWEEN "+longitude+" - ("+proximity+"/(69 * COS(RADIANS("+latitude+")))) AND "+longitude+" + (1"+proximity+"/(69* COS(RADIANS("+latitude+"))))) l, bus_stop b, Street s WHERE `distance` <"+proximity+" AND b.lid = l.id AND l.stid = s.id ORDER BY `distance` ASC;"; 

    let query = db.query(busQuery,(err,results) => {
        if (err) throw err;
        res.send(results);
    });
});

//Route for NPC for GET request to use on the SQL query
app.get('/npc', (req, res) => {
    var proximity = req.query.proximity;
    var latitude = req.query.latitude;
    var longitude = req.query.longitude;

    console.log(proximity,latitude,longitude);

    let npcQuery = "SELECT l.* , n.*, nc.division_name , s.* FROM (SELECT id, latitude, longitude, stid , 3956 * ACOS(COS(RADIANS("+latitude+")) * COS(RADIANS(`latitude`)) * COS(RADIANS("+longitude+") - RADIANS(`longitude`)) + SIN(RADIANS("+latitude+")) * SIN(RADIANS(`latitude`))) AS `distance`FROM location WHERE`latitude` BETWEEN "+latitude+" - ("+proximity+"/69) AND "+latitude+" + ("+proximity+"/69) AND `longitude` BETWEEN "+longitude+" - ("+proximity+"/(69 * COS(RADIANS("+latitude+")))) AND "+longitude+" + (1"+proximity+"/(69* COS(RADIANS("+latitude+"))))) l, npc n, npc_category nc, Street s WHERE `distance` <"+proximity+" AND n.lid = l.id AND n.division_id = nc.id AND n.npc_name NOT LIKE '%post%' AND l.stid = s.id ORDER BY `distance` ASC;"; 

    let query = db.query(npcQuery,(err,results) => {
        if (err) throw err;
        res.send(results);
    });
});

//Route for NPP for GET request to use on the SQL query
app.get('/npp', (req, res) => {
    var proximity = req.query.proximity;
    var latitude = req.query.latitude;
    var longitude = req.query.longitude;

    console.log(proximity,latitude,longitude);

    let nppQuery = "SELECT l.* , n.*, nc.division_name , s.* FROM (SELECT id, latitude, longitude, stid , 3956 * ACOS(COS(RADIANS("+latitude+")) * COS(RADIANS(`latitude`)) * COS(RADIANS("+longitude+") - RADIANS(`longitude`)) + SIN(RADIANS("+latitude+")) * SIN(RADIANS(`latitude`))) AS `distance`FROM location WHERE`latitude` BETWEEN "+latitude+" - ("+proximity+"/69) AND "+latitude+" + ("+proximity+"/69) AND `longitude` BETWEEN "+longitude+" - ("+proximity+"/(69 * COS(RADIANS("+latitude+")))) AND "+longitude+" + (1"+proximity+"/(69* COS(RADIANS("+latitude+"))))) l, npc n, npc_category nc, Street s WHERE `distance` <"+proximity+" AND n.lid = l.id AND n.division_id = nc.id AND n.npc_name LIKE '%post%' AND l.stid = s.id ORDER BY `distance` ASC;"; 

    let query = db.query(nppQuery,(err,results) => {
        if (err) throw err;
        res.send(results);
    });
});

//Route for hawker for GET request to use on the SQL query
app.get('/hawker', (req, res) => {
    var proximity = req.query.proximity;
    var latitude = req.query.latitude;
    var longitude = req.query.longitude;

    console.log(proximity,latitude,longitude);

    let hawkerQuery = "SELECT l.* , h.* , s.* FROM (SELECT id, latitude, longitude, stid , 3956 * ACOS(COS(RADIANS("+latitude+")) * COS(RADIANS(`latitude`)) * COS(RADIANS("+longitude+") - RADIANS(`longitude`)) + SIN(RADIANS("+latitude+")) * SIN(RADIANS(`latitude`))) AS `distance`FROM location WHERE`latitude` BETWEEN "+latitude+" - ("+proximity+"/69) AND "+latitude+" + ("+proximity+"/69) AND `longitude` BETWEEN "+longitude+" - ("+proximity+"/(69 * COS(RADIANS("+latitude+")))) AND "+longitude+" + (1"+proximity+"/(69* COS(RADIANS("+latitude+"))))) l, hawker_centre h, npc_category nc, Street s WHERE `distance` <"+proximity+" AND h.lid = l.id AND l.stid = s.id ORDER BY `distance` ASC;"; 

    let query = db.query(hawkerQuery,(err,results) => {
        if (err) throw err;
        res.send(results);
    });
});

//Route for bookmarks for GET request to use on the SQL query
app.post('/bookmark', (req, res) => {

  const bookmarkResults = {
    bookmarkname: req.body.bookmarkname,
    postalcode: req.body.postalcode,
  }

  //let bookmarkQuery = "INSERT INTO user_bookmarks_location (uid,lid,bookmarkname)";
  res.send(bookmarkResults);
});

//Route for bookmark for GET request to use on the SQL query
app.get('/bookmark', (req, res) => {
    var bookmarkname = req.query.bookmarkname;
    var postalcode = req.query.postalcode;

    console.log(bookmarkname);

    let bookmarkQuery = "SELECT * FROM user_bookmarks_location;";

    let query = db.query(bookmarkQuery,(err,results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Defne which port to run local server
app.listen('3000', () => {
    console.log('Server running on Port 3000');
});