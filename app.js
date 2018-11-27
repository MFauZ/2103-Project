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
    var postal = req.query.postal_code;

    console.log(postal);

    room = "(" + room + ")";

    //let housingQuery = "SELECT Distinct longitude, latitude, block, year, floors FROM group8.housing WHERE  locale_name LIKE " + "'%" + locale + "%'" + " AND year > "+ syear +" AND year < "+ eyear +" AND room_id in "+room+";";

    let housingQuery = "SELECT Distinct longitude, latitude, housing.id, postal_code, block, year, floors, GROUP_CONCAT(room.room_type) As Rooms FROM housing JOIN room on housing.room_id = room.id WHERE locale_name LIKE " + "'%" + locale + "%'" + " AND year > "+ syear +" AND year < "+ eyear +" AND room_id in "+room+"GROUP BY longitude, latitude;"

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
    //let primaryQuery = "SELECT l.* , sh.* , s.* FROM (SELECT id, latitude, longitude, stid , 3956 * ACOS(COS(RADIANS("+latitude+")) * COS(RADIANS(`latitude`)) * COS(RADIANS("+longitude+") - RADIANS(`longitude`)) + SIN(RADIANS("+latitude+")) * SIN(RADIANS(`latitude`))) AS `distance`FROM location WHERE`latitude` BETWEEN "+latitude+" - ("+proximity+"/69) AND "+latitude+" + ("+proximity+"/69) AND `longitude` BETWEEN "+longitude+" - ("+proximity+"/(69 * COS(RADIANS("+latitude+")))) AND "+longitude+" + ("+proximity+"/(69* COS(RADIANS("+latitude+"))))) l, School sh, Street s WHERE sh.level = 'primary' AND `distance` <"+proximity+" AND sh.lid = l.id AND l.stid = s.id ORDER BY `distance` ASC;";
    let primaryQuery = "SELECT sh.*, "+
   "(6371 * acos(cos( radians ("+latitude+" ) ) * cos( radians( `latitude` ) ) * cos(radians( `longitude` ) - radians("+longitude+")) + sin(radians("+latitude+")) * sin(radians(`latitude`)))) "+
   "AS `distance` "+
   "FROM school_distance sh WHERE sh.level = 'Primary' "+
   "HAVING `distance` < "+proximity+" " +
   "ORDER BY `distance` ASC; ";


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

    //let secondaryQuery = "SELECT l.* , sh.* , s.* FROM (SELECT id, latitude, longitude, stid , 3956 * ACOS(COS(RADIANS("+latitude+")) * COS(RADIANS(`latitude`)) * COS(RADIANS("+longitude+") - RADIANS(`longitude`)) + SIN(RADIANS("+latitude+")) * SIN(RADIANS(`latitude`))) AS `distance`FROM location WHERE`latitude` BETWEEN "+latitude+" - ("+proximity+"/69) AND "+latitude+" + ("+proximity+"/69) AND `longitude` BETWEEN "+longitude+" - ("+proximity+"/(69 * COS(RADIANS("+latitude+")))) AND "+longitude+" + ("+proximity+"/(69* COS(RADIANS("+latitude+"))))) l, School sh, Street s WHERE sh.level = 'secondary' AND `distance` <"+proximity+" AND sh.lid = l.id AND l.stid = s.id ORDER BY `distance` ASC;"; 

    let secondaryQuery = "SELECT sh.*, "+
   "(6371 * acos(cos( radians ("+latitude+" ) ) * cos( radians( `latitude` ) ) * cos(radians( `longitude` ) - radians("+longitude+")) + sin(radians("+latitude+")) * sin(radians(`latitude`)))) "+
   "AS `distance` "+
   "FROM school_distance sh WHERE sh.level = 'Secondary' "+
   "HAVING `distance` < "+proximity+" " +
   "ORDER BY `distance` ASC; ";

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

    //let combinedQuery = "SELECT l.* , sh.* , s.* FROM (SELECT id, latitude, longitude, stid , 3956 * ACOS(COS(RADIANS("+latitude+")) * COS(RADIANS(`latitude`)) * COS(RADIANS("+longitude+") - RADIANS(`longitude`)) + SIN(RADIANS("+latitude+")) * SIN(RADIANS(`latitude`))) AS `distance`FROM location WHERE`latitude` BETWEEN "+latitude+" - ("+proximity+"/69) AND "+latitude+" + ("+proximity+"/69) AND `longitude` BETWEEN "+longitude+" - ("+proximity+"/(69 * COS(RADIANS("+latitude+")))) AND "+longitude+" + ("+proximity+"/(69* COS(RADIANS("+latitude+"))))) l, School sh, Street s WHERE sh.level <> 'primary' AND sh.level <> 'secondary'  AND `distance` <"+proximity+" AND sh.lid = l.id AND l.stid = s.id ORDER BY `distance` ASC;"; 

    let combinedQuery = "SELECT sh.*, "+
   "(6371 * acos(cos( radians ("+latitude+" ) ) * cos( radians( `latitude` ) ) * cos(radians( `longitude` ) - radians("+longitude+")) + sin(radians("+latitude+")) * sin(radians(`latitude`)))) "+
   "AS `distance` "+
   "FROM school_distance sh WHERE sh.level <> 'Secondary' AND sh.level <> 'Primary' "+
   "HAVING `distance` < "+proximity+" " +
   "ORDER BY `distance` ASC; ";

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

    //let busQuery = "SELECT l.* , b.* , s.* FROM (SELECT id, latitude, longitude, stid , 3956 * ACOS(COS(RADIANS("+latitude+")) * COS(RADIANS(`latitude`)) * COS(RADIANS("+longitude+") - RADIANS(`longitude`)) + SIN(RADIANS("+latitude+")) * SIN(RADIANS(`latitude`))) AS `distance`FROM location WHERE`latitude` BETWEEN "+latitude+" - ("+proximity+"/69) AND "+latitude+" + ("+proximity+"/69) AND `longitude` BETWEEN "+longitude+" - ("+proximity+"/(69 * COS(RADIANS("+latitude+")))) AND "+longitude+" + ("+proximity+"/(69* COS(RADIANS("+latitude+"))))) l, bus_stop b, Street s WHERE `distance` <"+proximity+" AND b.lid = l.id AND l.stid = s.id ORDER BY `distance` ASC;"; 

    let busQuery = "SELECT bs.*, "+
   "(6371 * acos(cos( radians ("+latitude+" ) ) * cos( radians( `latitude` ) ) * cos(radians( `longitude` ) - radians("+longitude+")) + sin(radians("+latitude+")) * sin(radians(`latitude`)))) "+
   "AS `distance` "+
   "FROM bus_stop_distance bs "+
   "HAVING `distance` < "+proximity+" " +
   "ORDER BY `distance` ASC; ";

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

    //let npcQuery = "SELECT l.* , n.*, nc.division_name , s.* FROM (SELECT id, latitude, longitude, stid , 3956 * ACOS(COS(RADIANS("+latitude+")) * COS(RADIANS(`latitude`)) * COS(RADIANS("+longitude+") - RADIANS(`longitude`)) + SIN(RADIANS("+latitude+")) * SIN(RADIANS(`latitude`))) AS `distance`FROM location WHERE`latitude` BETWEEN "+latitude+" - ("+proximity+"/69) AND "+latitude+" + ("+proximity+"/69) AND `longitude` BETWEEN "+longitude+" - ("+proximity+"/(69 * COS(RADIANS("+latitude+")))) AND "+longitude+" + ("+proximity+"/(69* COS(RADIANS("+latitude+"))))) l, npc n, npc_category nc, Street s WHERE `distance` <"+proximity+" AND n.lid = l.id AND n.division_id = nc.id AND n.npc_name NOT LIKE '%post%' AND l.stid = s.id ORDER BY `distance` ASC;"; 

    let npcQuery = "SELECT *, "+
   "(6371 * acos(cos( radians ("+latitude+" ) ) * cos( radians( `latitude` ) ) * cos(radians( `longitude` ) - radians("+longitude+")) + sin(radians("+latitude+")) * sin(radians(`latitude`)))) "+
   "AS `distance` "+
   "FROM npc_distance WHERE npc_name NOT LIKE '%post%' "+
   "HAVING `distance` < "+proximity+" " +
   "ORDER BY `distance` ASC; ";


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

    //let nppQuery = "SELECT l.* , n.*, nc.division_name , s.* FROM (SELECT id, latitude, longitude, stid , 3956 * ACOS(COS(RADIANS("+latitude+")) * COS(RADIANS(`latitude`)) * COS(RADIANS("+longitude+") - RADIANS(`longitude`)) + SIN(RADIANS("+latitude+")) * SIN(RADIANS(`latitude`))) AS `distance`FROM location WHERE`latitude` BETWEEN "+latitude+" - ("+proximity+"/69) AND "+latitude+" + ("+proximity+"/69) AND `longitude` BETWEEN "+longitude+" - ("+proximity+"/(69 * COS(RADIANS("+latitude+")))) AND "+longitude+" + ("+proximity+"/(69* COS(RADIANS("+latitude+"))))) l, npc n, npc_category nc, Street s WHERE `distance` <"+proximity+" AND n.lid = l.id AND n.division_id = nc.id AND n.npc_name LIKE '%post%' AND l.stid = s.id ORDER BY `distance` ASC;"; 

    let nppQuery = "SELECT *, "+
   "(6371 * acos(cos( radians ("+latitude+" ) ) * cos( radians( `latitude` ) ) * cos(radians( `longitude` ) - radians("+longitude+")) + sin(radians("+latitude+")) * sin(radians(`latitude`)))) "+
   "AS `distance` "+
   "FROM npc_distance WHERE npc_name LIKE '%post%' "+
   "HAVING `distance` < "+proximity+" " +
   "ORDER BY `distance` ASC; ";
    
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

    //let hawkerQuery = "SELECT l.* , h.* , s.* FROM (SELECT id, latitude, longitude, stid , 3956 * ACOS(COS(RADIANS("+latitude+")) * COS(RADIANS(`latitude`)) * COS(RADIANS("+longitude+") - RADIANS(`longitude`)) + SIN(RADIANS("+latitude+")) * SIN(RADIANS(`latitude`))) AS `distance`FROM location WHERE`latitude` BETWEEN "+latitude+" - ("+proximity+"/69) AND "+latitude+" + ("+proximity+"/69) AND `longitude` BETWEEN "+longitude+" - ("+proximity+"/(69 * COS(RADIANS("+latitude+")))) AND "+longitude+" + ("+proximity+"/(69* COS(RADIANS("+latitude+"))))) l, hawker_centre h, npc_category nc, Street s WHERE `distance` <"+proximity+" AND h.lid = l.id AND l.stid = s.id ORDER BY `distance` ASC;"; 

    let hawkerQuery = "SELECT *, "+
   "(6371 * acos(cos( radians ("+latitude+" ) ) * cos( radians( `latitude` ) ) * cos(radians( `longitude` ) - radians("+longitude+")) + sin(radians("+latitude+")) * sin(radians(`latitude`)))) "+
   "AS `distance` "+
   "FROM hawker_distance "+
   "HAVING `distance` < "+proximity+" " +
   "ORDER BY `distance` ASC; ";
    
    let query = db.query(hawkerQuery,(err,results) => {
        if (err) throw err;
        res.send(results);
    });
});

//Route for housing for POST request from the grant form
app.post('/grant', (req, res) => {
  const grantResults = {
    userPostal: req.body.mylocation,
    parentPostal: req.body.parentlocation,
    marital: req.body.marital
  }
  res.send(grantResults);
});

//Route for housing for GET request to use on the SQL query
app.get('/grant', (req, res) => {
    var userPostal = req.query.userPostal;
    var parentPostal = req.query.parentPostal;
    var marital = req.query.marital;

    let grantQuery1 = "SELECT DISTINCT longitude, latitude FROM housing WHERE postal_code = '"+parentPostal+"'";

    let query = db.query(grantQuery1,(err,results) => {
        if (err) throw err;
        var queryLatitude = results[0]['latitude'];
        var queryLongitude = results[0]['longitude'];

        let grantQuery2 = "SELECT count(DISTINCT postal_code) as eligible, "+
        "(6371 * acos(cos( radians ("+queryLatitude+" ) ) * cos( radians( `latitude` ) ) * cos(radians( `longitude` ) - radians("+queryLongitude+")) + sin(radians("+queryLatitude+")) * sin(radians(`latitude`)))) "+
        "AS `distance` "+
        "FROM housing "+
        "WHERE postal_code = '"+userPostal+"' "+
        "HAVING `distance` < 4 " +
        "ORDER BY `distance` ASC; ";

        let query2 = db.query(grantQuery2,(err,results) => {
          if (err) throw err;

          try{
            var eligibility = results[0]['eligible'];
            var cost = 0;
            if (marital == "single"){
              cost = 10000
            }
            if (marital == "married"){
              cost = 20000
            }
            res.send({'eligibility': 1, 'cost':cost});
          }
          catch(err){
            res.send({'eligibility': 0});
          }
        });
    });
});


app.post('/bookmark', (req, res) => {

  var locationId = req.body.location;
  var block = req.body.block;

  console.log(locationId);

  let bookmarkQuery = "INSERT INTO user_bookmarks_location (uid, lid, bookmark_name) VALUES ((SELECT id FROM User WHERE username = '"+globalusername+"' LIMIT 1), "+ locationId+", '"+block+"');";

  let query = db.query(bookmarkQuery,(err,results) => {
        if (err) throw err;
        res.send(results);
  });

});

// //Route for bookmark for GET request to use on the SQL query
app.get('/bookmark', (req, res) => {

    let bookmarkQuery = "SELECT ub.* FROM user_bookmarks_location ub, user u WHERE u.id = ub.uid AND u.username = '"+globalusername+"'";

    let query = db.query(bookmarkQuery,(err,results) => {
        if (err) throw err;
        res.send({'bookmarks':results});
    });
});

// //Route for bookmark for GET request to use on the SQL query
app.get('/showbookmark', (req, res) => {

    var locationId = req.query.lid;

    console.log(locationId);

    let bookmarkQuery = "SELECT latitude, longitude FROM location L WHERE L.id ="+locationId+"";

    let query = db.query(bookmarkQuery,(err,results) => {
        if (err) throw err;
        res.send(results);
    });
});

// //Route for bookmark for GET request to use on the SQL query
app.delete('/bookmark', (req, res) => {

    bookmarkId = req.body.bid;

    let bookmarkQuery = "DELETE FROM user_bookmarks_location WHERE bookmark_name = '"+bookmarkId+"'";

    let query = db.query(bookmarkQuery,(err,results) => {
        if (err) throw err;
        res.send('Bookmark deleted!');
    });
});

// Defne which port to run local server
app.listen('3000', () => {
    console.log('Server running on Port 3000');
});