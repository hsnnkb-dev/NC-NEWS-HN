const app = require('../app');
const request = require('supertest');
const testData = require('../db/data/test-data');
const seed = require('../db/seeds/seed');
const db = require('../db/connection');

afterAll(() => db.end());
beforeEach(() => seed(testData))

describe('api', () => {
  describe('GET /non-existent-endpoint', () => {
    test('status: 404, when user tries to GET from a endpoint that doesn\'t exist', () => {
      return request(app)
              .get('/api/not-an-endpoint')
              .expect(404)
              .then(({ body }) => {
                expect(body.message).toBe('Not Found');
              })
    });
  });

  describe('GET /api/topics', () => {
    test('status: 200, returns an object with key \'topics\' with value of an array of objects', () => {
      return request(app)
              .get('/api/topics')
              .expect(200)
              .expect('Content-Type', 'application/json; charset=utf-8')
              .then(({ body }) => {
                const topics = body.topics;
                topics.forEach((topic) => {
                  expect(topic).toMatchObject({
                    slug: expect.any(String), 
                    description: expect.any(String)
                  });
                })
              });
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
                expect(articles.length).toBe(12);
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
                expect(articles.length).toBe(12);
                expect(articles).toBeSortedBy('created_at', { descending : true });
              });
    });
  });

  describe('GET /api/articles/:article_id', () => {
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

  describe('GET /api/articles/:article_id/comments', () => {
    test('status: 200, returns an object with key \'comments\' with an array of comment objects as the value', () => {
      return request(app)
              .get('/api/articles/3/comments')
              .expect(200)
              .expect('Content-Type', 'application/json; charset=utf-8')
              .then(({ body }) => {
                const comments = body.comments;
                expect(comments.length).toBe(2);
                comments.forEach((comment) => {
                  expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    body: expect.any(String),
                    votes: expect.any(Number),
                    author: expect.any(String),
                    article_id: 3,
                    created_at: expect.any(String),        
                  });
                })
              })
    });

    test('status: 200, comments are ordered by most recent', () => {
      return request(app)
              .get('/api/articles/1/comments')
              .expect(200)
              .expect('Content-Type', 'application/json; charset=utf-8')
              .then(({ body }) => {
                const comments = body.comments;
                expect(comments.length).toBe(11);
                expect(comments).toBeSortedBy('created_at', { descending : true })
                })
    });

    test('status: 200, returns an object with key \'comments\' with an empty array when passed a valid id', () => {
      return request(app)
              .get('/api/articles/2/comments')
              .expect(200)
              .expect('Content-Type', 'application/json; charset=utf-8')
              .then(({ body }) => {
                const comments = body.comments;
                expect(comments.length).toBe(0);
                expect(comments).toEqual([]);
              })
    });

    test('status: 400, when sent an article_id of the wrong type', () => {
      return request(app)
              .get('/api/articles/not_an_id/comments')
              .expect(400)
              .then(({ body }) => {
                expect(body.message).toBe('Bad Request');
              });
    });

    test('status: 404, when sent an article_id that doesn\'t exist', () => {
      return request(app)
              .get('/api/articles/444444/comments')
              .expect(404)
              .then(({ body }) => {
                expect(body.message).toBe('Not Found');
              });
    });
  });

  describe('POST /api/articles/:article_id/comments', () => {
    test('status: 201, returns an object with key \'postedComment\' with a comment object as the value', () => {
      const newComment = { username: 'icellusedkars', body: 'Smell ya later'}   
      return request(app)
              .post('/api/articles/2/comments')
              .expect(201)
              .expect('Content-Type', 'application/json; charset=utf-8')
              .send(newComment)
              .then(({ body }) => {
                const postedComment = body.postedComment;
                expect(postedComment.length).toBe(1);
                expect(postedComment[0]).toMatchObject({
                  comment_id: expect.any(Number),
                  body: 'Smell ya later',
                  votes: expect.any(Number),
                  author: 'icellusedkars',
                  article_id: 2,
                  created_at: expect.any(String),        
                })
              })
    });

    test('status: 404, user is not registered', () => {
      const newComment = { username: 'non-existent-user', body: 'perfectly normal comment'} 
      return request(app)
      .post('/api/articles/1/comments')
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe('Not Found');
      });
    });
    
    test('status: 404, comment sent to an article_id that doesn\'t exist', () => {
      const newComment = { username: 'icellusedkars', body: '>*^,^,^~~~' } 
      return request(app)
      .post('/api/articles/444444/comments')
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe('Not Found');
      });
    });
    
    test('status: 400, comment sent to an article_id of the wrong type', () => {
      const newComment = { username: 'icellusedkars', body: 'Don\'t have a cow, man!'}
      return request(app)
              .post('/api/articles/not_an_id/comments')
              .send(newComment)
              .expect(400)
              .then(({ body }) => {
                expect(body.message).toBe('Bad Request');
              });
    });

    test('status: 400, incorrect data types given for values', () => {
      const newComment = { username: 'icellusedkars', head: [] } 
      return request(app)
              .post('/api/articles/3/comments')
              .send(newComment)
              .expect(400)
              .then(({ body }) => {
                expect(body.message).toBe('Bad Request');
              });
    });


    test('status: 400, malformed request body, empty comment given', () => {
      const newComment = {} 
      return request(app)
              .post('/api/articles/4/comments')
              .send(newComment)
              .expect(400)
              .then(({ body }) => {
                expect(body.message).toBe('Bad Request');
              });
    });
  });

  describe('PATCH /api/articles/:article_id', () => {
    test('status: 200, resolves with an object with key \'updatedArticle\' and a value of an article object', () => {
      const votes = { inc_votes: 747 };
      return request(app)
              .patch('/api/articles/2')
              .send(votes)
              .expect(200)
              .expect('Content-Type', 'application/json; charset=utf-8')
              .then(({ body }) => {
                const upvotedArticle = body.upvotedArticle;
                expect(upvotedArticle[0]).toMatchObject({
                  article_id: 2,
                  title: expect.any(String),
                  topic: expect.any(String),
                  author: expect.any(String),
                  body: expect.any(String),
                  created_at: expect.any(String),
                  votes: 747}
                )
              })
    });

    test('status: 200, decrements the vote if passed an object with a negative integer', () => {
      const votes = { inc_votes: -200 };
      return request(app)
              .patch('/api/articles/2')
              .send(votes)
              .expect(200)
              .expect('Content-Type', 'application/json; charset=utf-8')
              .then(({ body }) => {
                const upvotedArticle = body.upvotedArticle;
                expect(upvotedArticle[0]).toMatchObject({
                  article_id: 2,
                  title: expect.any(String),
                  topic: expect.any(String),
                  author: expect.any(String),
                  body: expect.any(String),
                  created_at: expect.any(String),
                  votes: -200}
                )
              })
    });

    test('status: 404, article_id is non-existent', () => {
      const votes = { inc_votes: -400 };
      return request(app)
              .patch('/api/articles/47809')
              .send(votes)
              .expect(404)
              .then(({ body }) => {
                const message = body.message;
                expect(message).toBe('Not Found');
              })
    });

    test('status: 400, article_id is of the wrong type', () => {
      const votes = { inc_votes: -404 };
      return request(app)
              .patch('/api/articles/not_an_id')
              .send(votes)
              .expect(400)
              .then(({ body }) => {
                const message = body.message;
                expect(message).toBe('Bad Request');
              })
    });

    test('status: 400, malformed request body (empty)', () => {
      const votes = { };
      return request(app)
              .patch('/api/articles/1')
              .send(votes)
              .expect(400)
              .then(({ body }) => {
                const message = body.message;
                expect(message).toBe('Bad Request');
              })
    });

    test('status: 400, body request is of the wrong type', () => {
      const votes = { inc_votes: "not_a_number"};
      return request(app)
              .patch('/api/articles/1')
              .send(votes)
              .expect(400)
              .then(({ body }) => {
                const message = body.message;
                expect(message).toBe('Bad Request');
              })
    });
  });

  describe('GET /api/users', () => {
    test('status: 200, resolves with an object with key \'users\' and value of an array of user objects', () => {
      return request(app)
              .get('/api/users')
              .expect(200)
              .expect('Content-Type', 'application/json; charset=utf-8')
              .then(({ body }) => {
                const users = body.users;
                expect(users.length).toBe(4);
                users.forEach((user) => {
                  expect(user).toMatchObject({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                  })
                })
              })
    });
  });
});

