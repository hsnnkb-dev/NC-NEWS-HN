const app = require('../app');
const request = require('supertest');
const testData = require('../db/data/test-data');
const seed = require('../db/seeds/seed');
const db = require('../db/connection');

afterAll(() => db.end());
beforeEach(() => seed(testData))

describe('api', () => {
  describe('GET /api/topics', () => {
    test('status: 200, returns an object with key \'topics\' and value of an array of objects', () => {
      return request(app)
              .get('/api/topics')
              .expect(200)
              .expect('Content-Type', 'application/json; charset=utf-8')
              .then(({ body }) => {
                const topics = body.topics;
                expect(topics.length).toBe(3)
                expect(topics).toEqual(
                  expect.arrayContaining([
                    expect.objectContaining({ slug: 'mitch', description: 'The man, the Mitch, the legend' }),
                    expect.objectContaining({ slug: 'cats', description: 'Not dogs' }),
                    expect.objectContaining({ slug: 'paper', description: 'what books are made of' })
                  ]) // NOTE TO REVIEWER: can i use toMatchObject and match type or is it better this way?
                )
              });
    });
  });
})