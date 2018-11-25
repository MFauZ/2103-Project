//Include all Node.js dependencies here
const path = require('path');
const Cryptr = require('cryptr');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser=require('body-parser');
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

//Open connection for Mongoose here
mongoose.connect('mongodb://localhost:27017/blackhole', function (err) {
    if (err) throw err;
    console.log('Successfully connected to MongoDB');
});

//Define a schema
const Schema = mongoose.Schema;

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


//Route for housing for GET request to use on the Mongo query

var housingSchema = new Schema({
    locale: String,
    year: String,
    rooms: String

}, {collection:"residential"});

var housingModel = mongoose.model('housingModel', housingSchema);

app.get('/housing', (req, res) => {

    var locale = req.query.locale;
    var year = req.query.year;
    var syear = year.split("-")[0];
    var eyear = year.split("-")[1]
    var roomType = req.query.room;

    housingModel.find({
        locale: new RegExp('\\b' + locale + '\\b'),
        year: { '$gt': syear, '$lt': eyear },
        rooms : roomType

    }, function(err,result){
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
});

//Route for primary school for GET request to use on the SQL query

var primarySchema = new Schema({
    level: String,
    location: {
     type: { type: String },
     coordinates: []
 },
}, {collection:"school"});

primarySchema.index({ location: "2dsphere" });

var primaryModel = mongoose.model('primaryModel', primarySchema);

app.get('/primarysch', (req, res) => {
    var proximity = req.query.proximity;
    var latitude = req.query.latitude;
    var longitude = req.query.longitude;

    console.log(proximity);

    primaryModel.find({
        level: "PRIMARY",
        location: {
         $near: {
            $maxDistance: 2000 * proximity,
            $geometry: {
                type: "Point",
                coordinates: [longitude, latitude]
            }
        }
    }
}, function(err,result){
    if (err) throw err;
    console.log(result);
    res.send(result);
});
});

//Route for secondary school for GET request to use on the SQL query

var secondarySchema = new Schema({
    level: String,
    location: {
     type: { type: String },
     coordinates: []
 },
}, {collection:"school"});

secondarySchema.index({ location: "2dsphere" });

var secondaryModel = mongoose.model('secondaryModel', secondarySchema);

app.get('/secondarysch', (req, res) => {
    var proximity = req.query.proximity;
    var latitude = req.query.latitude;
    var longitude = req.query.longitude;

    console.log(proximity);

    secondaryModel.find({
        level: "SECONDARY",
        location: {
         $near: {
            $maxDistance: 2000 * proximity,
            $geometry: {
                type: "Point",
                coordinates: [longitude, latitude]
            }
        }
    }
}, function(err,result){
    if (err) throw err;
    console.log(result);
    res.send(result);
});
});

//Route for secondary school for GET request to use on the SQL query

var combinedSchema = new Schema({
    level: String,
    location: {
     type: { type: String },
     coordinates: []
 },
}, {collection:"school"});

combinedSchema.index({ location: "2dsphere" });

var combinedModel = mongoose.model('combinedyModel', combinedSchema);

app.get('/combinedsch', (req, res) => {
    var proximity = req.query.proximity;
    var latitude = req.query.latitude;
    var longitude = req.query.longitude;

    console.log(proximity);

    combinedModel.find({
        level: {$nin : ["PRIMARY", "SECONDARY"]},
        location: {
         $near: {
            $maxDistance: 2000 * proximity,
            $geometry: {
                type: "Point",
                coordinates: [longitude, latitude]
            }
        }
    }
}, function(err,result){
    if (err) throw err;
    console.log(result);
    res.send(result);
});
});


//Route for hawker for GET request to use on the noSQL query

var hawkerSchema = new Schema({    
    location: {
     type: { type: String },
     coordinates: []
 },
}, {collection:"hawker"});

hawkerSchema.index({ location: "2dsphere" });

var hawkerModel = mongoose.model('hawkerModel', hawkerSchema);

app.get('/hawker', (req, res) => {
    var proximity = req.query.proximity;
    var latitude = req.query.latitude;
    var longitude = req.query.longitude;

    console.log(proximity);

    hawkerModel.find({
        location: {
         $near: {
            $maxDistance: 2000 * proximity,
            $geometry: {
                type: "Point",
                coordinates: [longitude, latitude]
            }
        }
    }
}, function(err,result){
    if (err) throw err;
    console.log(result);
    res.send(result);
});
});


//Route for bus stops for GET request to use on the noSQL query

var bus_stopSchema = new Schema({
    location: {
     type: { type: String },
     coordinates: []
 },
}, {collection:"bus_stop"});

bus_stopSchema.index({ location: "2dsphere" });

var bus_stopModel = mongoose.model('bus_stopModel', bus_stopSchema);

app.get('/busstops', (req, res) => {
    var proximity = req.query.proximity;
    var latitude = req.query.latitude;
    var longitude = req.query.longitude;

    console.log(proximity);

    bus_stopModel.find({
        location: {
         $near: {
            $maxDistance: 2000 * proximity,
            $geometry: {
                type: "Point",
                coordinates: [longitude, latitude]
            }
        }
    }
}, function(err,result){
    if (err) throw err;
    console.log(result);
    res.send(result);
});
});

//Route for NPC for GET request to use on the noSQL query

var npcSchema = new Schema({
    npc_name: String,
    location: {
     type: { type: String },
     coordinates: []
 },
}, {collection:"NPC"});

npcSchema.index({ location: "2dsphere" });

var npcModel = mongoose.model('npcModel', npcSchema);

app.get('/npc', (req, res) => {
    var proximity = req.query.proximity;
    var latitude = req.query.latitude;
    var longitude = req.query.longitude;

    console.log(proximity);

    npcModel.find({
        npc_name: {$regex: /Police Centre/},
        location: {
         $near: {
            $maxDistance: 2000 * proximity,
            $geometry: {
                type: "Point",
                coordinates: [longitude, latitude]
            }
        }
    }
}, function(err,result){
    if (err) throw err;
    console.log(result);
    res.send(result);
});
});

//Route for NPP for GET request to use on the noSQL query

var nppSchema = new Schema({
    npc_name: String,
    location: {
     type: { type: String },
     coordinates: []
 },
}, {collection:"NPC"});

nppSchema.index({ location: "2dsphere" });

var nppModel = mongoose.model('nppModel', nppSchema);

app.get('/npp', (req, res) => {
    var proximity = req.query.proximity;
    var latitude = req.query.latitude;
    var longitude = req.query.longitude;

    console.log(proximity);

    nppModel.find({
        npc_name: {$regex: /Police Post/},
        location: {
         $near: {
            $maxDistance: 2000 * proximity,
            $geometry: {
                type: "Point",
                coordinates: [longitude, latitude]
            }
        }
    }
}, function(err,result){
    if (err) throw err;
    console.log(result);
    res.send(result);
});
});





// Defne which port to run local server
app.listen('8888', () => {
    console.log('Server running on Port 8888');
});