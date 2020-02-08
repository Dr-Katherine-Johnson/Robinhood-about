DROP DATABASE IF EXISTS abouts;
CREATE DATABASE abouts;
\c abouts;

CREATE TABLE tickers (
  /* Describe your table here.*/
  id SERIAL PRIMARY KEY,
  ticker VARCHAR (50) UNIQUE NOT NULL,
  about TEXT,
  CEO VARCHAR (200),
  open VARCHAR (50),
  high VARCHAR (50),
  low VARCHAR (50),
  marketCap VARCHAR (50),
  yearHigh VARCHAR (50),
  employees INT,
  headquarters VARCHAR (200),
  dividendYield INT,
  founded INT,
  averageVolume VARCHAR (50),
  volume VARCHAR (50)
);


/*  Execute this file from the command line (from same folder) by typing:
 *    psql postgres
 *    \i database/schema-postGres.sql
 * to connect to locahost: psql -h localhost -p 5432 -U siminlei abouts
 *  to create the database and the tables.*/

