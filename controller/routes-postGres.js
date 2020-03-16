const Router = require('express-promise-router')
const { db, pgp, query } = require('../database/index-postGres.js')
const router = new Router();
const { redisPost, redisGet } = require('./redis.js');
const { colLookup } = require('../server/numMiddleware.js')

// Create - need to create postabout
router.post('/', (req, res, next) => {
  let queryString = req.body;
  var inputKeys = Object.keys(queryString);
  
  // PG promise helpers
  var cs = new pgp.helpers.ColumnSet(inputKeys, {table: 'abouts'});
  var query = pgp.helpers.insert([queryString], cs) + 'RETURNING ticker';

  // start timer
  const start = Date.now()

  db.one(query)
  .then((result) => {
    const duration = Date.now() - start
    console.log('EXECUTED CREATE', { duration, rows: result })
    redisPost(queryString); //Redis add
    res.status(201).json(result);
    redisPost(queryString.ticker, queryString); //redis add
  })
  .catch((err) => {
    console.log('ERROR', err)
    res.status(400).json(`Error: ${err}`)     
  })
});

// Read
router.get('/:ticker', redisGet, (req, res, next) => {
  let queryString = req.params.ticker;
  let column = colLookup(queryString);

  // start timer
  const start = Date.now()
      //GET FROM API
      db.one('SELECT * FROM abouts WHERE $1~=$2', [column, queryString])
      .then((result) => {
        const duration = Date.now() - start
        console.log('EXECUTED READ', { duration, rows: result })

        res.status(200).json(result);
        redisPost(queryString, result); //Redis add
      })
      .catch((err) => {
        console.log(err)
        res.status(400).json(`Error: ${err}`)
      });   
}); 

// Update
// router.put('/:ticker', async (req, res) => {
//   let queryString = req.params.ticker;
//   var inputKeys = Object.keys(queryString);
  
//   // PG promise helpers
//   var cs = new pgp.helpers.ColumnSet(inputKeys, {table: 'abouts'});
//   console.log('HELLO')
//   var condition = pgp.as.format(` WHERE ticker = ${queryString}`, req.body);
//   var query = pgp.helpers.update(req.body, cs) + condition;

//   // start timer
//   const start = Date.now()
//   console.log('QUERY UPDATE: ', query)

//   db.one(query)
//   .then((result) => {
//     const duration = Date.now() - start
//     console.log('EXECUTED UPDATE', { duration, rows: result })
//     res.status(200).json(result);
//   })
//   .catch((err) =>
//     res.status(400).json(`Error: ${err}`)
//   );
// })

// Delete
router.delete('/:ticker', async (req, res) => {
  let queryString = req.params.ticker;
  const start = Date.now()

  db.result('DELETE FROM abouts WHERE ticker = $1', queryString)
  .then((result) => {
    const duration = Date.now() - start
    console.log('EXECUTED DELETE', { duration, rows: result.rowCount })
    res.status(200).json(result);
  })
  .catch((err) => {
    console.log('ERROR', err)
    res.status(400).json(`Error: ${err}`)
  });
})

module.exports = router;