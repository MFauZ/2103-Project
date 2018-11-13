const mysql = require('mysql');

// const db = mysql.createConnection({
//     host     : 'rm-gs5py2dcox6x82w4l6o.mysql.singapore.rds.aliyuncs.com', //'localhost',
//     user     : 'ict2103group8_2', //'root',
//     password : '2aS3zq86dB',
//     database  : 'group8'
// });

const db = mysql.createConnection({
    host     : 'localhost', //'localhost',
    user     : 'root', //'root',
    password : '',
    database  : 'group8'
});

//Conenct to Alibaba Database
db.connect((err) => {
    if(err){
        throw err; 
    }
    console.log('Connected to database..');
});

module.exports = db; 
