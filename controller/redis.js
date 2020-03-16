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
  client.exists(`data:${queryString}`, (err, reply) => {
    if (reply === 1) {
      client.hgetall(`data:${queryString}`, (err, result) => {
        if (result) {
          client.expire(`data:${queryString}`, 72000);
          console.log('GOT FROM REDIS', result)
          res.status(200).json(result);
        }
        if (err) {
          console.log('ERR IN REDIS: ', err)
        }
        return next('router');
      })
    } else {
      next();
    }
  }) 
}

module.exports = { redisPost, redisGet };
