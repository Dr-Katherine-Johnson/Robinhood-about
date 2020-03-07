require('dotenv').config()

module.exports = {
  PORT: process.env.PORT,
  DB_URL: process.env.DB_URL,
  SERVICE_API_URL: process.env.API_URL,
  REACT_APP_BASE: process.env.REACT_APP_BASE
};