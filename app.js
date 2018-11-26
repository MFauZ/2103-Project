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
cryptr = new Cryptr('myTotalySecretKey');

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
    res.render('index');
});

////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// -Login Modal -//////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

//Route for register for POST request from the form

var registerSchema = new Schema({
    email: String,
    username: String,
    password: String,
    created_time: Date,
    resid_bookmarks: Array

}, {collection:"user"});

var registerModel = mongoose.model('registerModel', registerSchema);

app.post('/register', (req, res) => {
    var remail = req.body.email;
    var rusername = req.body.username;
    var rpassword = cryptr.encrypt(req.body.password);
    var rtimer = new Date();

    var registerData = new registerModel({
        email: remail,
        username: rusername,
        password: rpassword,
        created_time: rtimer
    });

    registerData.save(function(err,result) {
        res.send(result);
        console.log("Registration Successfully");
        if (err) {
            console.error(err);
        }
    });
});

//Route for login for POST request from the form

var loginSchema = new Schema({
    email: String,
    username: String,
    password: String

}, {collection:"user"});

var loginModel = mongoose.model('loginModel', loginSchema);

app.post('/login', (req, res) => {
    var lemail = req.body.email;
    var lpassword = cryptr.encrypt(req.body.password);

    loginModel.find({
        email: lemail

    }, function(err,result){
        if (err){
            throw err;
        } 
        else{
            currentPassword = cryptr.decrypt(lpassword);
            savedPassword = cryptr.decrypt(result[0]['password']);
            if (currentPassword == savedPassword){
                globalusername = result[0]['username'];
                res.redirect('/session?valid=' + lpassword);
            }
            else{
                console.log("Invalid credentials");
            }
        }  
    });
});

//Route to get session ID if valid (Token is username encrypted)
app.get('/session', function (req, res) {
    res.render('map',{
        user : globalusername
    });
});

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

//Route for bookmark for POST request to use on the Mongo query

var bookmarkSchema = new Schema({
    resid_bookmarks: Array

}, {collection:"user"});

var bookmarkModel = mongoose.model('bookmarkModel', bookmarkSchema);

app.post('/bookmark', (req, res) => {

    var locationId = req.body.location;
    var block = req.body.block;
    var postalCode = req.body.postal_code

    console.log(postalCode);

    bookmarkModel.findOneAndUpdate(
    { username: globalusername }, 
    { $push: {
        resid_bookmarks: postalCode
    }}, function(err, product){
        if (err) throw err;
        console.log("Bookmarked!");
        res.send(results);
    });
});

// //Route for bookmark for GET request to use on the SQL query
app.get('/bookmark', (req, res) => {

    bookmarkModel.aggregate([
        {$unwind: "$resid_bookmarks"},{ $lookup: { from:"residential", localField:"resid_bookmarks", foreignField:"postal_code", as:"bookmark_details" }}
    ]).exec((err, result) => {
        if (err) throw err;
        res.send(result);
        console.log(result);
    })
});

// //Route for bookmark for GET request to use on the SQL query
app.delete('/bookmark', (req, res) => {

    bookmarkId = req.body.bid;
    console.log(bookmarkId);
    bookmarkModel.update(
    {username: globalusername},
    { $pull: {
        resid_bookmarks: bookmarkId
    }}, function(err,result){
        if (err) throw err;
        console.log("Deleted!");
        res.send(result);
    })

});

// Defne which port to run local server
app.listen('8888', () => {
    console.log('Server running on Port 8888');
});