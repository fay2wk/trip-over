/* globals it describe before after*/
const supertest = require('supertest')
const api = supertest('http://localhost:3000')
const expect = require('chai').expect
require('../app')
const City = require('../models/city')

var allCity
City.find({}, (err, res) => {
  if (err) console.log(err)
  allCity = res.length
})

const currentUser = {
  email: 'admin@gmail.com',
  auth_token: 'd4113582-3868-46a1-9aef-dd930faadb15'
}

describe('GET /city', () => {
  it('should return a 200 response', function (done) {
    this.timeout(5000)
    api.get('/city')
      .set('Accept', 'application/json')
      .expect(200, done)
  })
  it('should return all the cities', function (done) {
    api.get('/city')
      .set('Accept', 'application/json')
      .end((error, response) => {
        expect(error).to.be.a('null')
        expect(response.body.length).to.equal(allCity)
        done()
      })
  })
})

describe('GET /city/:id/attractions', () => {
  it('should return a 200 response', (done) => {
    api.get('/Batu/attractions')
      .set('Accept', 'application/json')
      .expect(200, done)
  })
  it('should return one city with all the attractions', (done) => {
    api.get('/Batu/attractions')
      .set('Accept', 'application/json')
      .end((error, response) => {
        expect(error).to.be.a('null')
        expect(response.body[0]).to.have.property('name')
        expect(response.body[0].attractions[0]).to.have.property('details')
        done()
      })
  })
})

describe('POST /city/:id', function () {
  var id
  before((done) => {
    api.post('/Batu/attractions')
      .set('Accept', 'application/json')
      .set('User-Email', currentUser.email)
      .set('Auth-Token', currentUser.auth_token)
      .send({
        'name': 'Test document',
        'details': 'This is a test file',
        'longitude': 'long',
        'lattitude': 'lat',
        'phoneNumber': '123-123-123',
        'img': 'placeholder'
      }).end((err, res) => {
        expect(err).to.be.a('null')
        id = res.body._id
        done()
      })
  })
  it('should let user create an attraction', (done) => {
    api.get('/Batu/attractions/' + id)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(err).to.be.a('null')
        expect(res.body.name).to.eql('Test document')
        done()
      })
  })
  it('should return a 200 response', (done) => {
    api.get('/Batu/attractions/' + id)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(err).to.be.a('null')
        expect(res.body.name).to.eq('Test document')
        done()
      })
  })
  after(function (done) {
    this.timeout = 5000
    api.delete('/Batu/attractions/' + id)
      .set('Accept', 'application/json')
      .set('User-Email', currentUser.email)
      .set('Auth-Token', currentUser.auth_token)
      .end((err) => {
        expect(err).to.be.a('null')
        done()
      })
  })
})

// describe('UPDATE /city/:id/attraction_id', () => {
//   it('should let user update an attraction', (done) => {
//     api.put('/Malang/attractions/5790a659ee3cf610000534c2')
//     .set('Accept', 'application/json')
//     .set('User-Email', currentUser.email)
//     .set('Auth-Token', currentUser.auth_token)
//     .send({
//       name: 'Test',
//       details: 'Testing details',
//       geoCode: {
//         longitude: '1234',
//         lattitude: '1234'
//       }
//     }).end((err, res) => {
//       expect(err).to.be.a('null')
//       expect(res.body.attractions[0]).to.eq('Updated test')
//       expect(res.body.attractions[0]).to.eq('For testing update function')
//       done()
//     })
//   })
//   after((done) => {
//     api.put('/Malang/attractions/5790a659ee3cf610000534c2')
//       .set('Accept', 'application/json')
//       .set('User-Email', currentUser.email)
//       .set('Auth-Token', currentUser.auth_token)
//       .send({
//         'name': 'Angsle Akor',
//         'details': 'Dessert: Indonesian-style sweet rice balls',
//         'phoneNumber': '0341-7744366',
//         'img': 'https://static.pexels.com/photos/5317/food-salad-restaurant-person-medium.jpg',
//         'geoCode': {
//           'lattitude': '-7.994331',
//           'longitude': '112.625743'
//         }
//       }).end((err) => {
//         expect(err).to.be.a('null')
//         done()
//       })
//   })
// })

describe('DELETE /city/:id/attraction_id', () => {
  var id
  before((done) => {
    api.post('/Batu/attractions')
      .set('Accept', 'application/json')
      .set('User-Email', currentUser.email)
      .set('Auth-Token', currentUser.auth_token)
      .send({
        'name': 'Delete',
        'details': 'Test file to be deleted',
        'longitude': 'long',
        'lattitude': 'lat',
        'phoneNumber': '123-123-123',
        'img': 'placeholder'
      }).end((err, res) => {
        expect(err).to.be.a('null')
        id = res.body_id
        done()
      })
  })
  it('should let user destroy an attraction', (done) => {
    api.delete('/Batu/attractions/' + id)
      .set('Accept', 'application/json')
      .set('User-Email', currentUser.email)
      .set('Auth-Token', currentUser.auth_token)
    done()
  })
  it('should be deleted', (done) => {
    api.get('/Batu/attractions/' + id)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(err).to.be.a('null')
        expect(res.body).to.be.a('null')
        done()
      })
  })
})
