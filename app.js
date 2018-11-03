const express = require('express');
const mysql = require('mysql');

//Establish sql connection
const db = mysql.createConnection({
    host     : 'rm-gs5py2dcox6x82w4l6o.mysql.singapore.rds.aliyuncs.com', //'localhost',
    user     : 'ict2103group8_2', //'root',
    password : '2aS3zq86dB',
    database  : 'group8'
});

//connect
db.connect((err) => {
    if(err){
        throw err; 
    }
    console.log('Mysql Connected..');
});

const app = express();

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
    console.log('Server started on port 3000');
});