const chai = require('chai');
const request = require('supertest');
const { app, server } = require('../server/index.js');

const expect = chai.expect;
const testObject = {
  ticker: "AAAAA",
  about: "ABOUT",
  CEO: "CEO",
  open: "OPEN",
  employees: 1,
  headquarters: 'HQ'
}
const testObjectNew = {
  ticker: "AAAAA",
  about: "ABOUTNEW",
  CEO: "CEONEW",
  open: "OPENNEW",
  employees: 100,
  headquarters: 'HQNEW'
}

//Create
describe('POST /about endpoint tests', () => {
  it('should return status code 201', done => {
    request(app)
      .post('/about')
      .send(testObject)
      .end(function(error, response, body) {
        if (error) {
          done(error);
        } else {
          expect(response.statusCode).to.equal(201);
          done();
        }
      });
  });
});

//Read
describe('GET /about/:ticker endpoint tests', () => {
  it('should return status code 200', done => {
    request(app)
      .get('/about/AAAAA')
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });
  it('should return a JSON object', done => {
    request(app)
      .get('/about/AAAAA')
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        done();
      });
  });
  it('should return information about the stock', done => {
    request(app)
      .get('/about/AAAAA')
      .end((err, res) => {
        expect(res.body.about).to.be.an('string');
        expect(res.body.employees).to.be.an('number');
        expect(res.body.CEO).to.be.an('string');
        expect(res.body.headquarters).to.be.an('string');
        done();
      });
  });
});

//Update
describe('PUT /about endpoint tests', () => {
  it('should return status code 200', done => {
    request(app)
      .put('/about/AAAAA')
      .send(testObjectNew)
      .end(function(error, response, body) {
        if (error) {
          done(error);
        } else {
          expect(response.statusCode).to.equal(200);
          done();
        }
      });
  });
});

//Delete
describe('DELETE /about endpoint tests', () => {
  it('should return status code 200', done => {
    request(app)
      .del('/about/AAAAA') //Note: delete is not a supertest function
      .expect(200)
      .end(function(error, response, body) {
        if (error) {
          done(error);
        } else {
          expect(response.statusCode).to.equal(200);
          done();
        }
      });
  });
});

server.close();
