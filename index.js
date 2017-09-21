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
var createRegionsTable = require('./region/region')

console.log(regionData);

//Create region table and then insert data
createRegionsTable(function(){
    pg.connect(conString, function (err, client, done) {
      if (err) {
        return console.error('error fetching client from pool', err)
      }
      client.query(format('INSERT INTO regions (name, B_X, B_Y, T_X, T_Y, Pk_Region_Id) VALUES %L', regionData), function (err, result) {
        done()

        if (err) {
          return console.error('error happened during query', err)
        }
        console.log("successfully inserted");
        process.exit(0)
      })
    })
});

app.listen(process.env.PORT || port, function() {
    console.log("app running");
});
