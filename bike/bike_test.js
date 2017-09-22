//Express
var express = require('express');
var exphbs  = require('express-handlebars');
const pg = require('pg')
const conString = 'postgres://coreyharrilal:Ironman1234@localhost/corey_db' // make sure to match your own database's credentials
var format = require('pg-format');
//Create tables
module.exports = function(callback){
    pg.connect(conString, function (err, client, done) {
      if (err) {
        return console.error('error fetching client from pool', err)
      }
      client.query("SELECT pk_region_id from regions where name = 'New York'" , [], function (err, result) {
        // done()

        if (err) {
          return console.error('error happened during query', err)
        }
        pk_region_id = result.rows[0].pk_region_id;
        callback(pk_region_id);
        console.log("the id is:   ___" + pk_region_id);
        process.exit(0)
      })
    })
}
