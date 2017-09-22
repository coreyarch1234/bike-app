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
var prompt = require('prompt');


var regionData = require('./region/region_dummy_data');

var bikeData = require('./bike/bike_dummy_data');


function createTables(){
    pg.connect(conString, function (err, client, done) {
      if (err) {
        return console.error('error fetching client from pool', err)
      }
      const queryRegionsTable = client.query('CREATE TABLE IF NOT EXISTS regions (name VARCHAR(255), B_X INT, B_Y INT, T_X INT, T_Y INT, Pk_Region_Id INT PRIMARY KEY)');
      queryRegionsTable.on('end', () => {})

      const queryBikesTable =  client.query('CREATE TABLE  IF NOT EXISTS bikes (Pk_Bike_Id INT PRIMARY KEY, X_COORD INT, Y_COORD INT, Pk_Region_Id INT REFERENCES regions(Pk_Region_Id))');
      queryBikesTable.on('end', () => {})
    })
}

function insertTable(){
    pg.connect(conString, function (err, client, done) {
      if (err) {
        return console.error('error fetching client from pool', err)
      }
      const insertIntoRegionsTable = client.query(format('INSERT INTO regions (name, B_X, B_Y, T_X, T_Y, Pk_Region_Id) VALUES %L', regionData));
      insertIntoRegionsTable.on('end', () => {console.log("insert into regions ended")})

      const insertIntoBikesTable =  client.query(format('INSERT INTO bikes (Pk_Bike_Id, X_COORD, Y_COORD, Pk_Region_Id) VALUES %L', bikeData));
      insertIntoBikesTable.on('end', () => {console.log("insert into bikes ended")})
    })
}
createTables();
// insertTable();

function getBikesFromRegion(name){
    pg.connect(conString, function (err, client, done) {
      if (err) {
        return console.error('error fetching client from pool', err)
      }
      client.query(format("SELECT pk_bike_id from regions inner join bikes on regions.pk_region_id = bikes.pk_region_id where name = '"  + name + "';" , []), function (err, result) {
        done()

        if (err) {
          return console.error('error happened during query', err)
        }
        console.log("For the " + name + " region: ");
        for (var i = 0; i < result.rows.length; i ++){
            console.log("The Bike Id(s) are: " + result.rows[i].pk_bike_id);
        }

        process.exit(0)
      })
    })
}

prompt.start();

prompt.get(['name'], function (err, result) {
    if (err) { return onErr(err); }
    console.log('Command-line input received:');
    console.log('  Name: ' + result.name);
    getBikesFromRegion(result.name);
});

function onErr(err) {
    console.log(err);
    return 1;
}

app.listen(process.env.PORT || port, function() {
    // console.log("app running");
});
