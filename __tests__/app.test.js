const app = require('../app');
const request = require('supertest');

describe('api', () => {
  describe('GET /api/topics', () => {
    test('status: 200, returns an array of topic objects', () => {
      return request(app)
              .get('/api/topics')
              .expect(200)
              .expect('Content-Type', 'application/json; charset=utf-8')
    })
  });
})