const pgp = require('pg-promise')({
    capSQL: true // capitalize all generated SQL
});
// const cn = 'postgres://localhost:5432/abouts';

const cn = {
    host: '127.0.0.1',
    port: 5432,
    database: 'abouts',
    user: 'postgres',
    password: 'password'
};

const db = pgp(cn);

const query = {
  any: (text, params, callback) => {
    // console.log('text: ', text, 'params: ', params)
    const start = Date.now()
    return db.any(text, params, (err, res) => {
      const duration = Date.now() - start
      console.log('executed query', { text, duration, rows: res })
      callback(err, res)
    });
  },
  one: (text, params, callback) => {
    console.log('text: ', text, 'params: ', params)
    const start = Date.now()
    return db.one(text, params, (err, res) => {
      const duration = Date.now() - start
      console.log('executed query', { text, duration, rows: res })
      callback(err, res)
    })
  },
  none: (text, params, callback) => {
    // console.log('text: ', text, 'params: ', params)
    const start = Date.now()
    return db.none(text, params, (err, res) => {
      const duration = Date.now() - start
      console.log('executed query', { text, duration, rows: res })
      callback(err, res)
    })
  }
}

module.exports = {
    pgp, db, query
};

