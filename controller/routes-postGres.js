const Router = require('express-promise-router')
const { db, pgp, query } = require('../database/index-postGres.js')
const router = new Router();

//REDIS
const redis = require("redis")
const client = redis.createClient()
client.on('error', (err) => {
    console.log("Error " + err)
})

client.on('connect', function() {
    console.log('Redis is now connected');
});

const redisPost = (body) => {
  client.hmset(`data:${body.ticker}`, body, (err, res) => {
    console.log('RES: ', res)
    client.expire(`data:${body.ticker}`, 14400, (err, res) => {
      console.log('ADDED TO REDIS: ', replies, " TICKER: ", body.ticker)
      if (err) {
        console.log(err)
      }
    })
  });
}

// Create - need to create postabout
router.post('/', async (req, res) => {
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
  })
  .catch((err) => {
    console.log('ERROR', err)
    res.status(400).json(`Error: ${err}`)     
  })
});

// Read
router.get('/:ticker', async (req, res) => {
  let queryString = req.params.ticker;
  // start timer
  const start = Date.now()

  //CHECK IF EXISTS IN REDIS
  client.exists(`data:${queryString}`, (err, reply) => {
    if (reply === 1) {
      client.hgetall(`data:${queryString}`, (err, result) => {
        if (result) {
          client.expire(`data:${queryString}`, 72000);
          console.log('GOT FROM REDIS', result)
          res.status(200).json(result);
        } else {
          //GET FROM API
          db.one('SELECT * FROM abouts WHERE ticker = $1', [queryString])
          .then((result) => {
            const duration = Date.now() - start
            console.log('EXECUTED READ', { duration, rows: result })

            redisPost(result); //Redis add

            res.status(200).json(result);
          })
          .catch((err) =>
            res.status(400).json(`Error: ${err}`)
          );   
        }
      })
    }
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