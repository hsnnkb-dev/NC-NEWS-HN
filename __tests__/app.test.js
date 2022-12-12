const app = require('../app');
const request = require('supertest');
const testData = require('../db/data/test-data');
const seed = require('../db/seeds/seed');
const db = require('../db/connection');

afterAll(() => db.end());
beforeEach(() => seed(testData))

describe('api', () => {
  describe('GET /api/topics', () => {
    test('status: 200, returns an object with key \'topics\' with value of an array of objects', () => {
      return request(app)
              .get('/api/topics')
              .expect(200)
              .expect('Content-Type', 'application/json; charset=utf-8')
              .then(({ body }) => {
                const topics = body.topics;
                topics.forEach((topic) => {
                  expect(topic).toMatchObject({slug: expect.any(String), description: expect.any(String)});
                })
              });
    });

    test('status: 404, when user tries to GET from misspelt endpoint', () => {
      return request(app)
              .get('/api/tciops')
              .expect(404)
              .then(({ body }) => {
                expect(body.message).toBe('Not Found');
              })
    });
  });

  describe('GET /api/articles', () => {
    test('status: 200, returns an object with key \'articles\' with value of an array of objects', () => {
      return request(app)
              .get('/api/articles')
              .expect(200)
              .expect('Content-Type', 'application/json; charset=utf-8')
              .then(({ body }) => {
                const articles = body.articles;
                expect(articles.length).toBe(5);
                articles.forEach((article) => {
                  expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    comment_count: expect.any(String)
                  });
                })
              });
    });

    test('status: 200, returns an object with key \'articles\' with an array is sorted by date newest-first', () => {
      return request(app)
              .get('/api/articles')
              .expect(200)
              .expect('Content-Type', 'application/json; charset=utf-8')
              .then(({ body }) => {
                const articles = body.articles;
                expect(articles.length).toBe(5);
                expect(articles).toBeSortedBy('created_at', { descending : true });
              });
    });

  });

  describe.only('GET /api/articles/:article_id', () => {
    test('status: 200, returns an object with key \'article\' with value of the article object', () => {
      return request(app)
              .get('/api/articles/4')
              .expect(200)
              .expect('Content-Type', 'application/json; charset=utf-8')
              .then(({ body }) => {
                const article = body.article;
                expect(article.length).toBe(1);
                expect(article[0]).toMatchObject({
                  author: expect.any(String),
                  title: expect.any(String),
                  article_id: 4,
                  body: expect.any(String),
                  topic: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                });
              })
    });

    test('status: 400, when sent an article_id of the wrong type', () => {
      return request(app)
              .get('/api/articles/not_an_id')
              .expect(400)
              .then(({ body }) => {
                expect(body.message).toBe('Bad Request');
              });
    });

    test('status: 404, when sent an article_id that doesn\'t exist', () => {
      return request(app)
              .get('/api/articles/444444')
              .expect(404)
              .then(({ body }) => {
                expect(body.message).toBe('Not Found');
              });
    });
  });
});
