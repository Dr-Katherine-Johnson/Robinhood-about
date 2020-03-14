//Redis caching
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
    console.log('RES', res)
    client
      .multi([
        // ["zadd", "views", 1, ticker, redis.print],
        ["expire", `data:${body.ticker}`, 300] // when first posted, allow it to persist for 20 HOURS
      ])
      .exec(function(err, replies) {
        console.log('REPLIED', replies)
        return replies;
      });
  });
}

const redisGet = (ticker) => {
  return client.exists(`data:${ticker}`, (err, reply) => {
    if (reply === 1) {
      console.log('HELLO', client.hgetall(`data:${ticker}`, (err, res) => {
        if (err) {
          console.log(err)
        } else {
          client.expire(`data:${ticker}`, 72000);
          console.log('RES', res)
          return res;
        }
      })
      )
    }
  });
}

module.exports = {
  redisGet, redisPost
};
