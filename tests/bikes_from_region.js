// //Testing
// function testData(){
//     pgtest.expect('SELECT * FROM test_table').returning(null, [
//     [ 1000 ],
//     ["hello"]
// ]);
//     pgtest.connect(conString, function (err, client, done) {
//         client.query('SELECT * FROM test_table', function (err, data) {
//             console.log("here is the data");
//             console.log(data);
//             done();
//         });
//     });
//
//     pgtest.check(); //No errors
//
// }
