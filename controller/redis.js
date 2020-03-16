//Connect
const redis = require("redis")
const client = redis.createClient()
client.on('error', (err) => {
    console.log("Error " + err)
})

client.on('connect', function() {
    console.log('Redis is now connected');
});

//Post
const redisPost = (ticker, body) => {
  client.hmset(`data:${ticker}`, body, (err, result) => {
    // console.log('RES: ', result)
    client.expire(`data:${ticker}`, 14400, (err, result) => {
      console.log('ADDED TO REDIS: ', ticker)
      if (err) {
        console.log(err)
      }
    })
  });
}

const redisGet = (req, res, next) => {
  let queryString = req.params.ticker;
  client.hgetall(`data:${queryString}`, (err, result) => {
    if (err) {
      console.log('ERR IN REDIS: ', err)
    }
    if (result.length > 0) {
      res.status(200).json(result);
      console.log('GOT FROM REDIS', result.ticker, 'ID: ', queryString)
      client.expire(`data:${queryString}`, 72000, (err, result) => {
        return next('router');
      });
    } else {
      next();
    }
  })
}

module.exports = { redisPost, redisGet };
