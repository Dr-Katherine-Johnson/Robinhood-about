const { Pool, Client } = require('pg')
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/abouts';
// const connectionObj = {
//     user: 'siminlei',
//     host: 'localhost',
//     database: 'abouts',
//     port: 3211,
// }
const pool = new Pool(connectionString)
const client = new Client(connectionString)

// Set up tables

module.exports = {
  prep: async () => {
    try {
      await pool.query('DROP TABLE IF EXISTS "abouts"')
      await pool.query('CREATE TABLE "abouts" (id SERIAL PRIMARY KEY, ticker VARCHAR (50) UNIQUE NOT NULL, about TEXT, CEO VARCHAR (200), open VARCHAR (50), high VARCHAR (50), low VARCHAR (50), marketCap VARCHAR (50), yearHigh VARCHAR (50), employees INT, headquarters VARCHAR (200), dividendYield INT, founded INT, averageVolume VARCHAR (50), volume VARCHAR (50))')
      await console.log('connected')
    } catch(err) {
      console.error('connection error', err.stack);
    }
  },
  query: (text, params, callback) => {
    console.log('text: ', text, 'params: ', params)
    const start = Date.now()
    return pool.query(text, params, (err, res) => {
      const duration = Date.now() - start
      console.log('executed query', { text, duration, rows: res })
      callback(err, res)
    })
  },
  getClient: (callback) => {
    pool.connect((err, client, done) => {
      const query = client.query
      // monkey patch the query method to keep track of the last query executed
      client.query = (...args) => {
        client.lastQuery = args
        return query.apply(client, args)
      }
      // set a timeout of 5 seconds, after which we will log this client's last query
      const timeout = setTimeout(() => {
        console.error('A client has been checked out for more than 5 seconds!')
        console.error(`The last executed query on this client was: ${client.lastQuery}`)
      }, 5000)
      const release = (err) => {
        // call the actual 'done' method, returning this client to the pool
        done(err)
        // clear our timeout
        clearTimeout(timeout)
        // set the query method back to its old un-monkey-patched version
        client.query = query
      }
      callback(err, client, release)
    })
  }
}