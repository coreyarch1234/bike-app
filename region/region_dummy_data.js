//Express
var express = require('express');
var exphbs  = require('express-handlebars');

//(name VARCHAR(255), B_X INT, B_Y INT, T_X INT, T_Y INT, Pk_Region_Id PRIMARY KEY)

//Feel free to add new regions
var regionValues = [
    ['San Francisco', 1, 0, 3, 3, 1], // (1,0) (3,3)
    ['San Mateo', 4, 0, 6, 6, 2 ], // (4,0) (6,6)
    ['New York', 8, 2, 12, 8, 3 ], // (8,2) (12, 8)
];

module.exports = regionValues;
