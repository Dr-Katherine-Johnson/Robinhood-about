// const mongoose = require("mongoose");
// const dbHandler = require("./db-handler");
// const { DATABASE } = require("../tempConfig.js"); //NEED TO CHANGE
// const { About } = require(`../database/index-${ DATABASE }.js`);
// const { save } = require(`../seeds/save-${ DATABASE }.js`);

// /**
//  * Connect to a new in-memory database before running any tests.
//  */
// beforeAll(async () => await dbHandler.connect());

// /**
//  * Clear all test data after every test.
//  */
// afterEach(async () => await dbHandler.clearDatabase());

// /**
//  * Remove and close the db and server.
//  */
// afterAll(async () => await dbHandler.closeDatabase());

// /**
//  * test suite.
//  */
// describe("Seed script ", () => {
//   const find = callback => {
//     About.find({}, (err, results) => {
//       if (err) {
//         console.log("Err: ", err);
//       } else {
//         console.log("Results: ", results.length);
//         callback(null, results);
//       }
//     });
//   };

//   const areUnique = callback => {
//     find((err, results) => {
//       if (err) {
//         console.log("err: ", err);
//       } else {
//         let arr = [];
//         results.forEach(item => {
//           arr.push(item.ticker);
//         });
//         for (let i = 0; i < arr.length; i++) {
//           for (let j = i + 1; arr.length; j++) {
//             if (arr[i] === arr[j]) {
//               callback(err, null);
//             }
//           }
//         }
//         callback(null, true);
//       }
//     });
//   };

//   it("it will successfully seed database", async () => {
//     expect(async () => await save()).not.toThrow();
//   });

//   it("it will create 100 items in the collection", done => {
//     find((err, result) => {
//       if (err) {
//         console.log("err: ", err);
//       } else {
//         expect(result.length).toBe(100);
//         done();
//       }
//     });
//   });

//   it("it will create 100 unique tickers", done => {
//     areUnique((err, result) => {
//       if (err) {
//         console.log("err: ", err);
//       } else {
//         expect(result).toBe(true);
//         done();
//       }
//     });
//   });
// });
