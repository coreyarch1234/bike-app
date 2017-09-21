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


//Create tables
function createTable(){
    pg.connect(conString, function (err, client, done) {
      if (err) {
        return console.error('error fetching client from pool', err)
      }
      client.query('CREATE TABLE test_table(   age integer   );', function (err, result) {
        done()

        if (err) {
          return console.error('error happened during query', err)
        }
        // console.log(result.row[0]);
        process.exit(0)
      })
    })
}

//Insert data
function insertData(){
    pg.connect(conString, function (err, client, done) {
      if (err) {
        return console.error('error fetching client from pool', err)
      }
      client.query('INSERT INTO test_table VALUES ($1);', [100], function (err, result) {
        done()

        if (err) {
          return console.error('error happened during query', err)
        }
        console.log("successfully inserted");
        process.exit(0)
      })
    })
}

//Testing
function testData(){
    pgtest.expect('SELECT * FROM test_table').returning(null, [
    [ 1000 ],
    ["hello"]
]);
    pgtest.connect(conString, function (err, client, done) {
        client.query('SELECT * FROM test_table', function (err, data) {
            console.log("here is the data");
            console.log(data);
            done();
        });
    });

    pgtest.check(); //No errors

}

app.listen(process.env.PORT || port, function() {
    console.log("app running");
});
