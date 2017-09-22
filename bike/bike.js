//Bike table
// - Pk_Bike_Id INT PRIMARY KEY
// - X_Coord INT
// - Y_Coord INT
// - Pk_Region_Id INT FOREIGN KEY REFERENCES regions(Pk_Region_Id)


//Express
var express = require('express');
var exphbs  = require('express-handlebars');
const pg = require('pg')
const conString = 'postgres://coreyharrilal:Ironman1234@localhost/corey_db' // make sure to match your own database's credentials

//Create tables
module.exports = function(callback){

    pg.connect(conString, function (err, client, done) {
      if (err) {
        return console.error('error fetching client from pool', err)
      }

      client.query('CREATE TABLE bikes(Pk_Bike_Id INT PRIMARY KEY, X_COORD INT, Y_COORD INT, Pk_Region_Id INT REFERENCES regions(Pk_Region_Id));',
      function (err, result) {
        done()
        if (err) {
          return console.error('error happened during query', err)
        }
        console.log("Created bikes table");
        callback()
        process.exit(0)
      })
    })
}
