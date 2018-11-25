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
// app.post('/housing', (req, res) => {
//   const housingResults = {
//     locale: req.body.locale,
//     year: req.body.year,
//     room: req.body.roomtype
//   }
//   res.send(housingResults);
// });

// //Route for housing for GET request to use on the SQL query
// app.get('/housing', (req, res) => {
//     var locale = req.query.locale;
//     var year = req.query.year;
//     var syear = year.split("-")[0];
//     var eyear = year.split("-")[1]
//     var room = String(req.query.room);

//     room = "(" + room + ")";

//     //let housingQuery = "SELECT Distinct longitude, latitude, block, year, floors FROM group8.housing WHERE  locale_name LIKE " + "'%" + locale + "%'" + " AND year > "+ syear +" AND year < "+ eyear +" AND room_id in "+room+";";

//     let housingQuery = "SELECT Distinct longitude, latitude, housing.id, block, year, floors, GROUP_CONCAT(room.room_type) As Rooms FROM housing JOIN room on housing.room_id = room.id WHERE locale_name LIKE " + "'%" + locale + "%'" + " AND year > "+ syear +" AND year < "+ eyear +" AND room_id in "+room+"GROUP BY longitude, latitude;"

//     let query = db.query(housingQuery,(err,results) => {
//         if (err) throw err;
//         res.send(results);
//     });
// });

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


app.post('/bookmark', (req, res) => {

  var locationId = req.body.location;
  var block = req.body.block;

  //console.log(block);

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






/***************MONGO***********************/

//// Bus stops
var bus_stopArr = [];

// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/blackhole');

// // Wait until connection is established
// mongoose.connection.on('open', function(err, doc){
//     console.log("connection established");

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/admin');
mongoose.connection.on('open', function(err, doc){
    console.log("MongoDB connected");
    mongoose.connection.db.collection('bus_stop', function(err, docs) {
    // Check for error
    if(err) return console.log(err);
    // Walk through the cursor
    docs.find().each(function(err, doc) {
        // Check for error
        if(err) return console.err(err);
        // Log document
        // console.log(doc);
        bus_stopArr.push(doc);
    })
});
});


// });


// Testing with dummy data from mongodb
app.get('/bus_stop', (req, res) => {

    res.send(bus_stopArr);
});


// //// Housing

app.post('/residential', (req, res) => {
  const housingResults = {
    locale: req.body.locale,
    year: req.body.year,
    room: req.body.roomtype
}
res.send(housingResults);
//console.log(123 + JSON.stringify(housingResults));
});



// Testing with residential data from mongodb
app.get('/residential', (req, res) => {

    var locale = req.query.locale;
    var year = req.query.year;
    var syear = year.split("-")[0];
    var eyear = year.split("-")[1]
    var room = req.query.room;

    var roomType = '';

    console.log(room);

    for(var i=0; i<room.length; i++){
        console.log(room[i]);

        if(room[i] == 2){
            roomType = 'Two Rooms';
        }
        else if(room[i] == 3){
            roomType = 'Three Rooms';
        }
        else if(room[i] == 4){
            roomType = 'Four Rooms';
        }
        else if(room[i] == 5){
            roomType = 'Five Rooms';
        }

    }


    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";    

    var query;

    var arr = [];

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("blackhole");
    // if(room.length <= 1){      
    //     query = { 
    //         "locale": new RegExp('\\b' + locale + '\\b'),
    //         "year": { '$gt': syear, '$lt': eyear },
    //         "rooms": [roomType] //this will return blocks with ONLY the specified room type
    //     };
    // }
    if(room.length <= 1){      
        query = { 
            "locale": new RegExp('\\b' + locale + '\\b'),
            "year": { '$gt': syear, '$lt': eyear },
            "rooms": roomType //this will return blocks SO LONG AS the specified type exists 
        };
    }
    else{
        query = { 
            "locale": new RegExp('\\b' + locale + '\\b'),
            "year": { '$gt': syear, '$lt': eyear },
            "rooms": roomType //this will return every type
        };
    }


    dbo.collection("residential").find(query).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        res.send(result);
        arr.push(result);
    // db.close();
});
});

});


app.get('/primarysch', (req, res) => {

});

app.get('/secondarysch', (req, res) => {

});

app.get('/combinedsch', (req, res) => {

});






app.get('/npp', (req, res) => {

});






var MongoClient = require('mongodb').MongoClient;
var dbname = "blackhole"
var collection_name = "residential"
var url = "mongodb://localhost:27017/";
var target = [];
var long_lat;

//https://stackoverflow.com/questions/25734092/query-locations-within-a-radius

var kmToRadian = function(km){
    var earthRadiusInKm = 6371;
    return km / earthRadiusInKm;
};


MongoClient.connect(url, function(err, db) {
    if (err) throw err;

    var dbo = db.db("blackhole");
    // dbo.collection("residential").find({postal_code:"100088"}).toArray(function(err, result) {
    //     if(err) throw err;
    //     //console.log(result);
    //     target.push(result);
    // });
    function waitasecond(){
        long_lat = [ 103.8082549, 1.27736919 ];//dynamic
        //target[0][0].location.coordinates; //returns long and lat
        console.log(long_lat)
        var query = {
            "location" : {
                $geoWithin : {
                    $centerSphere : [long_lat, kmToRadian(0.1) ]//dynamic
                }
            }
        };

        app.get('/busstops', (req, res) => {

            dbo.collection("bus_stop").find(query).toArray(function(err, result) {
                if (err) throw err;
                console.log("-----------------Bus Stop-----------------------------\n");
                for(var i = 0; i < result.length;i++){
                    console.log(result[i]);
                    console.log(result[0].location.coordinates);
                    console.log("\n")
                }
            });

        });

        
        dbo.collection("residential").find(query).toArray(function(err, result) {
            if (err) throw err;
            console.log("-----------------Residential-----------------------------\n");
            for(var i = 0; i < result.length;i++){
                console.log(result[i]);
                console.log(result[0].location.coordinates);
                console.log("\n")
            }
        });

        app.get('/npc', (req, res) => {

            dbo.collection("NPC").find(query).toArray(function(err, result) {
                if (err) throw err;
                console.log("-----------------NPC-----------------------------\n");
                for(var i = 0; i < result.length;i++){
                    console.log(result[i]);
                    console.log(result[0].location.coordinates);
                    console.log("\n")
                }
            });
        });

        app.get('/hawker', (req, res) => {

            dbo.collection("hawker").find(query).toArray(function(err, result) {
                if (err) throw err;
                console.log("-----------------hawker-----------------------------\n");
                for(var i = 0; i < result.length;i++){
                    console.log(result[i]);
                    console.log(result[0].location.coordinates);
                    console.log("\n")
                }        
            });
        });
        
        app.get('/school', (req, res) => {

            dbo.collection("school").find(query).toArray(function(err, result) {
                if (err) throw err;
                console.log("-----------------School-----------------------------\n");
                for(var i = 0; i < result.length;i++){
                    console.log(result[i]);
                    console.log(result[0].location.coordinates);
                    console.log("\n")
                }
            });
        });
        db.close();
    }

    
    setTimeout(waitasecond,1000);

    
    






});






// Defne which port to run local server
app.listen('3000', () => {
    console.log('Server running on Port 3000');
});