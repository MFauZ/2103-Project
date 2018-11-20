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

        
        dbo.collection("bus_stop").find(query).toArray(function(err, result) {
            if (err) throw err;
            console.log("-----------------Bus Stop-----------------------------\n");
            for(var i = 0; i < result.length;i++){
                console.log(result[i]);
                console.log(result[0].location.coordinates);
                console.log("\n")
            }
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

        
        dbo.collection("NPC").find(query).toArray(function(err, result) {
            if (err) throw err;
            console.log("-----------------NPC-----------------------------\n");
            for(var i = 0; i < result.length;i++){
                console.log(result[i]);
                console.log(result[0].location.coordinates);
                console.log("\n")
            }
        });

        dbo.collection("hawker").find(query).toArray(function(err, result) {
            if (err) throw err;
            console.log("-----------------hawker-----------------------------\n");
            for(var i = 0; i < result.length;i++){
                console.log(result[i]);
                console.log(result[0].location.coordinates);
                console.log("\n")
            }        
        });

        
        dbo.collection("school").find(query).toArray(function(err, result) {
            if (err) throw err;
            console.log("-----------------School-----------------------------\n");
            for(var i = 0; i < result.length;i++){
                console.log(result[i]);
                console.log(result[0].location.coordinates);
                console.log("\n")
            }
        });
    
        db.close();
    }

    
    setTimeout(waitasecond,1000);

    
    






});