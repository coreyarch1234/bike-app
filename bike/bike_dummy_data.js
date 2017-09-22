//Express
var express = require('express');
var exphbs  = require('express-handlebars');

//Bike table
// - Pk_Bike_Id INT PRIMARY KEY
// - X_Coord INT
// - Y_Coord INT
// - Fk_Region_Id INT FOREIGN KEY REFERENCES regions(Pk_Region_Id)

//Feel Free to add new bikes
var bikeValues = [
    [1, 2, 1, 1], // (2,1)
    [2, 5, 3, 2 ], // (5,3)
    [3, 8, 2, 3 ], // (8,2)
    [4, 8, 2, 3 ],
    [5, 5, 3, 1 ]

];

module.exports = bikeValues;
