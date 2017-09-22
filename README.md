# Bikes and Regions Spec Project

This project assumes that we live in a 2D world that could be represented by a pair of x and y coordinates. There are regions that divide this world and there are bikes on these regions. The regions are rectangles and can be represented with the top right corner coordinates and the bottom left corner coordinates. 

The overall goal is to create a utility class that allows us to fetch any bikes within a particular region. To do this, I: 

1. Set up a Postgres database in Node.js. 
2. Used postgres to create the bikes and regions tables.
3. Inserted dummy bike and region data into the tables. 
4. Wrote a function that took in a name of a region as input and returned the ids of the bikes that belong to it. 

To set up:
1) Clone the repo
2) Run 'npm install'
3) Use nodemon ('npm install --save nodemon')
4) Type 'nodemon' into the terminal to start the application. (the port is 8080).

* Make sure postgres is running. Feel free to use the postgres mac application.

 * **Note:** I will be linking important files in this documentation. Feel free to click and view in a separate tab. I will be going over the important methods and implementations.

# Step 1 - Setting up the environment:

The dependencies used are: 
``` 
"dependencies": {
    "body-parser": "^1.18.1",
    "express": "^4.15.4",
    "express-handlebars": "^3.0.0",
    "pg": "^6.4.2",
    "pg-format": "^1.0.4",
    "pgtest": "^0.2.2",
    "prompt": "^1.0.0"
  }
```

The [server file](index.js) uses the node-postgres package (https://www.npmjs.com/package/pg), which allows us to connect to postgres and write queries: 
```
const pg = require('pg')
```
It also includes ```pg-format```, which allows us to loop through an array of data when inserting data into a SQL table. 

# Step 2 - Creating the Tables:

There are 2 tables that need to be created. One is the regions table that contains the following columns:

- name VARCHAR(255), 
- B_X INT, (Bottom left x coordinate)
- B_Y INT, (Bottom left y coordinate)
- T_X INT, (Top right x coordinate)
- T_Y INT, (Top right y coordinate)
- Pk_Region_Id PRIMARY KEY (region primary id)


The second is the bikes table:

- Pk_Bike_Id INT PRIMARY KEY
- X_Coord INT 
- Y_Coord INT
- Pk_Region_Id INT REFERENCES regions(Pk_Region_Id) (this is the foreign key that relates to the primary key of the regions table) 

To generate these tables, I created a ```createTables()``` function:

```
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

```

First, I connect to postgres. Using the query function, I make a query that creates both tables if they do not exist already. Our first query is:

```
const queryRegionsTable = client.query('CREATE TABLE IF NOT EXISTS regions (name VARCHAR(255), B_X INT, B_Y INT, T_X INT, T_Y INT, Pk_Region_Id INT PRIMARY KEY)');
```
and our second is:
```
const queryBikesTable =  client.query('CREATE TABLE  IF NOT EXISTS bikes (Pk_Bike_Id INT PRIMARY KEY, X_COORD INT, Y_COORD INT, Pk_Region_Id INT REFERENCES regions(Pk_Region_Id))');
```

The next step is to create dummy data for insertion.

# Step 3 - Creating the dummy data:

The [region data](region/region_dummy_data.js) is made up of three arrays of data with respective values. Notice that the names are cities. This is stored in ```regionValues``` and is exported to be used in the server file. 

```
//Feel free to add new regions
var regionValues = [
    ['San Francisco', 1, 0, 3, 3, 1], // (1,0) (3,3)
    ['San Mateo', 4, 0, 6, 6, 2 ], // (4,0) (6,6)
    ['New York', 8, 2, 12, 8, 3 ], // (8,2) (12, 8)
];

module.exports = regionValues;
```

I similarly created data for the bikes table, which can be found [here](bike/bike_dummy_data.js):
```
//Feel Free to add new bikes
var bikeValues = [
    [1, 2, 1, 1], // (2,1)
    [2, 5, 3, 2 ], // (5,3)
    [3, 8, 2, 3 ], // (8,2)
    [4, 8, 2, 3 ],
    [5, 5, 3, 1 ]

];

module.exports = bikeValues;
```
Notice the primary and foreign key values, as they will be essential in determining what bikes belong to what regions.

Now that we have the data, we are able to insert.

# Step 4 - Insertion of Data into Tables:

I created a concise function that takes care of this in the [server file](index.js):

```
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
```

**Note:** There are 2 lines of code that call the createTables() and insertTable() functions:

```
createTables();
// insertTable();
```
You can call createTables() repeatedly as I have a check so that a table is not created if it exists already. This could cause an error without the check. 

However, the insertTable() function cannot insert data into a table that does not exist. So, the createTables() function must be run first while the insertTable() call is commented. Afterwards, you can run the insertTable() function, but only once. 

# Step 5 - Get Bikes from a Region:

Here is where I accomplished the main goal of the app. The function, ```getBikesFromRegion()```:

```
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
```

uses a query that takes advantage of an inner join in SQL. The query is:
```
"SELECT pk_bike_id from regions inner join bikes on regions.pk_region_id = bikes.pk_region_id where name = '"  + name + "';"
```
It finds the pk_bike_ids from the bikes table where the foreign pk_region_id of the bikes table equals that of the regions table. It takes in the ```name``` parameter that can be any city that has been inserted. It will then return the ```result```. I can call ```result.rows``` to get all of the pk_bike_ids. Here, I use a for loop to print out the statement:

```
console.log("The Bike Id(s) are: " + result.rows[i].pk_bike_id);
```
for every bike. I then create a prompt so that you can type in a city in the terminal and see all of the bike ids that belong to that region. I do this with:

```

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
```

With more time, I would have added a way to get the region from a given bike.  I would have also created tests using the ```pgtest``` package.

