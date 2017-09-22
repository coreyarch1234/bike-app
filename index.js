//Middleware

//Express
var express = require('express');
var exphbs  = require('express-handlebars');
//App
var app = express();
var port = 8080;
//To parse post requests
var bodyParser = require('body-parser');

//postgresql
const pg = require('pg')
const conString = 'postgres://coreyharrilal:Ironman1234@localhost/corey_db' // make sure to match your own database's credentials
var pgtest = require('pgtest');
var format = require('pg-format');


var regionData = require('./region/region_dummy_data');
var createRegionsTable = require('./region/region');

var bikeData = require('./bike/bike_dummy_data');
var createBikesTable = require('./bike/bike');
var bikeTest = require('./bike/bike_test');

console.log(regionData);
console.log(bikeData);

//Create region table and then insert data
// createRegionsTable(function(){
//     pg.connect(conString, function (err, client, done) {
//       if (err) {
//         return console.error('error fetching client from pool', err)
//       }
//       client.query(format('INSERT INTO regions (name, B_X, B_Y, T_X, T_Y, Pk_Region_Id) VALUES %L', regionData), function (err, result) {
//         done()
//
//         if (err) {
//           return console.error('error happened during query', err)
//         }
//         console.log("successfully inserted region data");
//         process.exit(0)
//       })
//     })
// });

// //Create bike table and then insert data
// createBikesTable(function(){
//     pg.connect(conString, function (err, client, done) {
//       if (err) {
//         return console.error('error fetching client from pool', err)
//       }
//       client.query(format('INSERT INTO bikes (Pk_Bike_Id, X_COORD, Y_COORD, Pk_Region_Id) VALUES %L', bikeData), function (err, result) {
//         done()
//
//         if (err) {
//           return console.error('error happened during query', err)
//         }
//         console.log("successfully inserted bike data");
//         process.exit(0)
//       })
//     })
// });

//Function that takes in a bike location and checks it's location against all regions and returns the correct regions

bikeTest(function(pk_region_id){
    var pk_region_id = 1;
    console.log("before")
    pg.connect(conString, function (err, client, done) {
        console.log("after")
      if (err) {
        return console.error('error fetching client from pool', err)
      }
      console.log("reaches query");
      client.query(format("SELECT * from bikes where pk_region_id = " + pk_region_id.toString() + ";" , []), function (err, result) {
        done()

        if (err) {
          return console.error('error happened during query', err)
        }
        console.log("we got the bike: " + result.rows[0].x_coord);
        process.exit(0)
      })
    })
})

// bikeTest(function(){
//     var pk_region_id = 1;
//     console.log("the bike is: " + pk_region_id);
// })


//Function that takes a region name that exists and returns all bikes there
// function getRegionIdFromRegion(callback){
//     pg.connect(conString, function (err, client, done) {
//       if (err) {
//         return console.error('error fetching client from pool', err)
//       }
//       client.query(format("SELECT pk_region_id from regions where name = 'New York'" , []), function (err, result) {
//         done()
//
//         if (err) {
//           return console.error('error happened during query', err)
//         }
//         pk_region_id = result.rows[0].pk_region_id;
//         callback(result.rows[0].pk_region_id);
//         console.log(pk_region_id);
//         process.exit(0)
//       })
//     })
// }
//
// getRegionIdFromRegion(function(pk_region_id){
//     pg.connect(conString, function (err, client, done) {
//       if (err) {
//         return console.error('error fetching client from pool', err)
//       }
//       client.query(format("SELECT * from bikes where pk_region_id = " + pk_region_id.toString() + ";" , []), function (err, result) {
//         done()
//
//         if (err) {
//           return console.error('error happened during query', err)
//         }
//         console.log("we got the bike: " + result.rows[0].x_coord);
//         process.exit(0)
//       })
//     })
// })
// pg.connect(conString, function (err, client, done) {
//   if (err) {
//     return console.error('error fetching client from pool', err)
//   }
//   client.query(format("SELECT * from bikes where pk_region_id = '1';" , []), function (err, result) {
//     done()
//
//     if (err) {
//       return console.error('error happened during query', err)
//     }
//     console.log("we got the bike: " + result.rows[0].x_coord);
//     process.exit(0)
//   })
// })



app.listen(process.env.PORT || port, function() {
    console.log("app running");
});
