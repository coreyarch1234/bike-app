//Region table
// - Name VARCHAR(255)
// - B_X INT
// - B_Y INT
// - T_X INT
// - T_Y INT
// - Pk_Region_Id INT PRIMARY KEY


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

      client.query('CREATE TABLE regions(name VARCHAR(255), B_X INT, B_Y INT, T_X INT, T_Y INT, Pk_Region_Id INT PRIMARY KEY);',
      function (err, result) {
        done()
        if (err) {
          return console.error('error happened during query', err)
        }
        console.log("Created regions table");
        callback()
        process.exit(0)
      })
    })
}
