const app = require('../app');
const request = require('supertest');
const testData = require('../db/data/test-data');
const seed = require('../db/seeds/seed');
const db = require('../db/connection');

afterAll(() => db.end());
beforeEach(() => seed(testData));

describe('POST /api/...', () => {
  describe('POST /api/articles', () => {
    test('status: 201, posts a new article and returns the posted article', () => {
      const newArticle = { 
        author: 'icellusedkars', 
        title: 'my first post', 
        body: 'I\'m soooooo hungry',
        topic: 'cats'
      };
      return request(app)
              .post('/api/articles')
              .send(newArticle)
              .expect(201)
              .then(({ body }) => {
                const postedArticle = body.postedArticle;
                expect(postedArticle.length).toBe(1);
                expect(postedArticle[0]).toMatchObject({
                  author: 'icellusedkars',
                  title: 'my first post',
                  article_id: 13,
                  body: 'I\'m soooooo hungry',
                  topic: 'cats',
                  created_at: expect.any(String),
                  votes: 0,
                  comment_count: "0"
                })
              })
    });

    test('status: 404, author is not a registered user', () => {
      const newArticle = { 
        author: 'not_a_user', 
        title: 'my first post', 
        body: 'I\'m soooooo hungry',
        topic: 'cats'
      };
      
      return request(app)
              .post('/api/articles')
              .send(newArticle)
              .expect(404)
              .then(({ body }) => {
                const message = body.message;
                expect(message).toBe('Not Found')
              })
    });

    test('status: 404, topic is not present in database', () => {
      const newArticle = { 
        author: 'butter_bridge', 
        title: 'my first post', 
        body: 'I\'m soooooo hungry',
        topic: 'not_a_topic'
      }
      
      return request(app)
              .post('/api/articles')
              .send(newArticle)
              .expect(404)
              .then(({ body }) => {
                const message = body.message;
                expect(message).toBe('Not Found')
              })
    });

    test('status: 400, malformed request body missing data', () => {
      const newArticle = {
        author: 'icellusedkars', 
        topic: 'cats'
      };
      
      return request(app)
              .post('/api/articles')
              .send(newArticle)
              .expect(400)
              .then(({ body }) => {
                const message = body.message;
                expect(message).toBe('Bad Request')
              })
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

  describe('POST /api/topics', () => {
    test('status: 201, creates a new topic when passed a valid request body', () => {
      const newTopic = {
        slug: 'newTopic',
        description: 'The best topic to ever exist'
      }
      
      return request(app)
              .post('/api/topics')
              .send(newTopic)
              .expect(201)
              .expect('Content-Type', 'application/json; charset=utf-8')
              .then(({ body }) => {
                const postedTopic = body.postedTopic;
                expect(postedTopic.length).toBe(1);
                expect(postedTopic[0]).toMatchObject({
                  slug: expect.any(String),
                  description: expect.any(String)
                })
              });
    });

    test('status: 400, malformed request body', () => {
      const newTopic = {
        description: 'The best topic to ever exist'
      }
      
      return request(app)
              .post('/api/topics')
              .send(newTopic)
              .expect(400)
              .then(({ body }) => {
                const message = body.message;
                expect(message).toBe('Bad Request');
              });
    });
  });
});

describe('GET /api/...', () => {
  describe('GET /api', () => {
    test('status: 200, returns available endpoints info', () => {
      return request(app)
              .get('/api')
              .expect(200)
              .then(({ body }) => {
                const availableEndpoints = body.availableEndpoints;
                expect(availableEndpoints).toMatchObject({
                  "GET /api": expect.any(Object),
                  "GET /api/topics": expect.any(Object),
                  "GET /api/articles": expect.any(Object),
                  "GET /api/articles/:article_id": expect.any(Object),
                  "GET /api/articles/:article_id/comments": expect.any(Object),
                  "POST /api/articles/:article_id/comments": expect.any(Object),
                  "PATCH /api/articles/:article_id": expect.any(Object),
                  "GET /api/users": expect.any(Object),
                  "DELETE /api/comments/:comment_id": expect.any(Object),
                })
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

  describe('GET /api/articles? (topic, sort_by, order)', () => {
    test('status: 200, resolves with articles of all topics when passed no topic query', () => {
      return request(app)
              .get('/api/articles?')
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
              })
    });

    test('status: 200, resolves with all articles of specified topic', () => {
      return request(app)
              .get('/api/articles?topic=mitch')
              .expect(200)
              .expect('Content-Type', 'application/json; charset=utf-8')
              .then(({ body }) => {
                const articles = body.articles;
                expect(articles.length).toBe(11);
                articles.forEach((article) => {
                  expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: "mitch",
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    comment_count: expect.any(String)
                  });
                })
              })
    });

    test('status: 200, resolves with an empty array when there are no articles with a valid specified topic', () => {
      return request(app)
              .get('/api/articles?topic=paper')
              .expect(200)
              .expect('Content-Type', 'application/json; charset=utf-8')
              .then(({ body }) => {
                const articles = body.articles;
                expect(articles.length).toBe(0);
              })
    });

    test('status: 200, resolves with an array of articles sorted by title, descending', () => {
      return request(app)
              .get('/api/articles?sort_by=title')
              .expect(200)
              .expect('Content-Type', 'application/json; charset=utf-8')
              .then(({ body }) => {
                const articles = body.articles;
                expect(articles.length).toBe(12);
                expect(articles).toBeSortedBy('title', { descending : true })
              })
    });

    test('status: 200, resolves with an array of articles sorted by created_at, ascending', () => {
      return request(app)
              .get('/api/articles?order=asc')
              .expect(200)
              .expect('Content-Type', 'application/json; charset=utf-8')
              .then(({ body }) => {
                const articles = body.articles;
                expect(articles.length).toBe(12);
                expect(articles).toBeSortedBy('created_at', { ascending : true })
              })
    });

    test('status: 200, resolves with an array of articles sorted by votes, ascending, with topic \'mitch\'', () => {
      return request(app)
              .get('/api/articles?topic=mitch&sort_by=votes&order=asc')
              .expect(200)
              .expect('Content-Type', 'application/json; charset=utf-8')
              .then(({ body }) => {
                const articles = body.articles;
                expect(articles.length).toBe(11);
                expect(articles).toBeSortedBy('votes', { ascending : true });
                articles.forEach((article) => {
                  expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: "mitch",
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    comment_count: expect.any(String)
                  });
                })
              })
    });

    test('status: 404, malformed request topic doesn\'t exist', () => {
      return request(app)
              .get('/api/articles?topic=not_a_topic')
              .expect(404)
              .then(({ body }) => {
                const message = body.message;
                expect(message).toBe('Not Found');
              })
    });

    test('status: 400, malformed request sort_by doesn\'t exist', () => {
      return request(app)
              .get('/api/articles?sort_by=not_a_column')
              .expect(400)
              .then(({ body }) => {
                const message = body.message;
                expect(message).toBe('Bad Request');
              })
    });

    test('status: 400, malformed request order doesn\'t exist', () => {
      return request(app)
              .get('/api/articles?order=not_an_order')
              .expect(400)
              .then(({ body }) => {
                const message = body.message;
                expect(message).toBe('Bad Request');
              })
    });

    test('status: 404, malformed request, two correct queries and a single query is incorrect', () => {
      return request(app)
              .get('/api/articles?topic=mitch&sort_by=not_a_column&order=asc')
              .expect(400)
              .then(({ body }) => {
                const message = body.message;
                expect(message).toBe('Bad Request');
              })
    });
  });

  describe('GET /api/articles? (limit, p), total_count', () => {   
    test('status: 200, returns 6 articles when passed the limit query with a value', () => {
      return request(app)
              .get('/api/articles?limit=6')
              .expect(200)
              .expect('Content-Type', 'application/json; charset=utf-8')
              .then(({ body }) => {
                const articles = body.articles;
                expect(articles.length).toBe(6);
                articles.forEach(article => {
                  expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    comment_count: expect.any(String)
                  })
                })
              })
    });

    test('status: 200, returns the last articles, when passed p with value 2 and limit is at default', () => {
      return request(app)
              .get('/api/articles?p=2')
              .expect(200)
              .expect('Content-Type', 'application/json; charset=utf-8')
              .then(({ body }) => {
                const articles = body.articles;
                expect(articles.length).toBe(2);
                articles.forEach(article => {
                  expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    comment_count: expect.any(String)
                  })
                })
              })
    });

    test('status: 200, returns the middle articles, when passed a page and a limit', () => {
      return request(app)
              .get('/api/articles?limit=4&p=2')
              .expect(200)
              .expect('Content-Type', 'application/json; charset=utf-8')
              .then(({ body }) => {
                const articles = body.articles;
                expect(articles.length).toBe(4);
                articles.forEach(article => {
                  expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    comment_count: expect.any(String)
                  })
                })
              })
    });

    test('status: 200, returns an empty array when page exceeds number of articles', () => {
      return request(app)
              .get('/api/articles?p=200')
              .expect(200)
              .expect('Content-Type', 'application/json; charset=utf-8')
              .then(({ body }) => {
                const articles = body.articles;
                expect(articles.length).toBe(0);
              })
    });

    test('status: 200, returns response with total_count property', () => {
      return request(app)
              .get('/api/articles')
              .expect(200)
              .expect('Content-Type', 'application/json; charset=utf-8')
              .then(({ body }) => {
                const totalCount = body.total_count;
                expect(totalCount).toBe(12)
              })
    });

    test('status: 200, returns response with total_count property when a filter is applied', () => {
      return request(app)
              .get('/api/articles?topic=mitch')
              .expect(200)
              .expect('Content-Type', 'application/json; charset=utf-8')
              .then(({ body }) => {
                const totalCount = body.total_count;
                expect(totalCount).toBe(11)
              })
    });
            
    test('status: 400, when passed a limit query with the wrong value type', () => {
      return request(app)
              .get('/api/articles?limit=not_a_number')
              .expect(400)
              .then(({ body }) => {
                const message = body.message;
                expect(message).toBe('Bad Request')
              })
    });

    test('status: 400, when passed a p query with the wrong value type', () => {
      return request(app)
              .get('/api/articles?p=not_a_number')
              .expect(400)
              .then(({ body }) => {
                const message = body.message;
                expect(message).toBe('Bad Request')
              })
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

  describe('GET /api/articles/:article_id (Comment count)', () => {
    test('status: 200, returns an object with key \'article\' with value of the article object', () => {
      return request(app)
              .get('/api/articles/1')
              .expect(200)
              .expect('Content-Type', 'application/json; charset=utf-8')
              .then(({ body }) => {
                const article = body.article;
                expect(article.length).toBe(1);
                expect(article[0]).toMatchObject({
                  author: expect.any(String),
                  title: expect.any(String),
                  article_id: 1,
                  body: expect.any(String),
                  topic: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                  comment_count: '11'
                });
              })
    });

    test('status: 200, returns an object with key \'article\' with value of the article object when comment_count is 0', () => {
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
                  comment_count: '0'
                });
              })
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

  describe('GET /api/articles/:article_id/comments? (limit, p)', () => {
    test('status: 200, returns the specified number of comments when passed a limit with a value', () => {
      return request(app)
              .get('/api/articles/1/comments?limit=3')
              .expect(200)
              .expect('Content-Type', 'application/json; charset=utf-8')
              .then(({ body }) => {
                const comments = body.comments;
                expect(comments.length).toBe(3);
              });
    });

    test('status: 200, returns the last comments when passed a page query', () => {
      return request(app)
              .get('/api/articles/1/comments?p=2')
              .expect(200)
              .expect('Content-Type', 'application/json; charset=utf-8')
              .then(({ body }) => {
                const comments = body.comments;
                expect(comments.length).toBe(1);
              });
    });

    test('status: 200, returns the middle comments when passed the middle page', () => {
      return request(app)
              .get('/api/articles/1/comments?p=4&limit=2')
              .expect(200)
              .expect('Content-Type', 'application/json; charset=utf-8')
              .then(({ body }) => {
                const comments = body.comments;
                expect(comments.length).toBe(2);
              });
    });

    test('status: 400, when limit value is of the wrong type', () => {
      return request(app)
              .get('/api/articles/1/comments?limit=not_a_number')
              .expect(400)
              .then(({ body }) => {
                const message = body.message;
                expect(message).toBe('Bad Request');
              });
    });

    test('status: 400, when page value is of the wrong type', () => {
      return request(app)
              .get('/api/articles/1/comments?p=not_a_number')
              .expect(400)
              .then(({ body }) => {
                const message = body.message;
                expect(message).toBe('Bad Request');
              });
    });
  });

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

  describe('GET /api/users/:username', () => {
    test('status: 200, returns the correct user', () => {
      return request(app)
              .get('/api/users/icellusedkars')
              .expect(200)
              .expect('Content-Type', 'application/json; charset=utf-8')
              .then(({ body }) => {
                const user = body.user;
                expect(user.length).toBe(1);
                expect(user[0]).toMatchObject({
                  username: "icellusedkars",
                  avatar_url: expect.any(String),
                  name: expect.any(String)
                })
              })
    });

    test('status: 400, incorrect username', () => {
      return request(app)
              .get('/api/users/214114212')
              .expect(400)
              .then(({ body }) => {
                const message = body.message;
                expect(message).toBe('Bad Request');
              })
    });
  });
});

describe('PATCH /api/...', () => {
  describe('PATCH /api/articles/:article_id', () => {
    test('status: 200, resolves with an object with key \'updatedArticle\' and a value of an article object', () => {
      const votes = { inc_votes: 747 };
      return request(app)
              .patch('/api/articles/2')
              .send(votes)
              .expect(200)
              .expect('Content-Type', 'application/json; charset=utf-8')
              .then(({ body }) => {
                const updatedArticle = body.updatedArticle;
                expect(updatedArticle[0]).toMatchObject({
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
                const updatedArticle = body.updatedArticle;
                expect(updatedArticle[0]).toMatchObject({
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

  describe('PATCH /api/comments/:comment_id', () => {
    test('status: 200, returns the updated comment', () => {
      const newVotes = { inc_votes: 200 }
      return request(app)
              .patch('/api/comments/2')
              .send(newVotes)
              .expect(200)
              .then(({ body }) => {
                const updatedComment = body.updatedComment;
                expect(updatedComment.length).toBe(1);
                expect(updatedComment[0]).toMatchObject({
                  comment_id: 2,
                  body: expect.any(String),
                  votes: 214,
                  author: expect.any(String),
                  article_id: expect.any(Number),
                  created_at: expect.any(String),
                })
              })
    });

    test('status: 200, decrements the vote count', () => {
      const newVotes = { inc_votes: -200 }
      return request(app)
              .patch('/api/comments/2')
              .send(newVotes)
              .expect(200)
              .then(({ body }) => {
                const updatedComment = body.updatedComment;
                expect(updatedComment.length).toBe(1);
                expect(updatedComment[0]).toMatchObject({
                  comment_id: 2,
                  body: expect.any(String),
                  votes: -186,
                  author: expect.any(String),
                  article_id: expect.any(Number),
                  created_at: expect.any(String),
                })
              })
    });

    test('status: 400, comment_id is of wrong type', () => {
      const newVotes = { inc_votes: 14 }
      return request(app)
              .patch('/api/comments/not_an_id')
              .send(newVotes)
              .expect(400)
              .then(({ body }) => {
                const message = body.message;
                expect(message).toBe('Bad Request')
              })
    });

    test('status: 400, malformed request body', () => {
      const newVotes = {};
      return request(app)
              .patch('/api/comments/not_an_id')
              .send(newVotes)
              .expect(400)
              .then(({ body }) => {
                const message = body.message;
                expect(message).toBe('Bad Request')
              })
    });

    test('status: 400, request body has wrong type', () => {
      const newVotes = { inc_votes: "incorrect_type"};
      return request(app)
              .patch('/api/comments/not_an_id')
              .send(newVotes)
              .expect(400)
              .then(({ body }) => {
                const message = body.message;
                expect(message).toBe('Bad Request')
              })
    });

    test('status: 404, comment_id is non-existent', () => {
      const newVotes = { inc_votes: 14 }
      return request(app)
              .patch('/api/comments/809135')
              .send(newVotes)
              .expect(404)
              .then(({ body }) => {
                const message = body.message;
                expect(message).toBe('Not Found')
              })
    });
  });
});

describe('DELETE /api/...', () => {
  describe('DELETE /api/articles/:article_id', () => {
    test('status: 204, no content on success', () => {
      return request(app)
              .delete('/api/articles/7')
              .expect(204)
    });

    test('status: 400, article_id is of the wrong type', () => {
      return request(app)
              .delete('/api/articles/not_a_number')
              .expect(400)
              .then(({ body }) => {
                const message = body.message;
                expect(message).toBe('Bad Request')
              })
    });

    test('status: 404, article_id does not exist', () => {
      return request(app)
              .delete('/api/articles/300')
              .expect(404)
              .then(({ body }) => {
                const message = body.message;
                expect(message).toBe('Not Found')
              })
    });
  });

  describe('DELETE /api/comments/:comment_id', () => {
    test('status: 204, returns no content on success', () => {
      return request(app)
              .delete('/api/comments/3')
              .expect(204);
    });

    test('status: 400, comment_id is of the wrong type', () => {
      return request(app)
              .delete('/api/comments/not_an_id')
              .expect(400)
              .then(({ body }) => {
                const message = body.message;
                expect(message).toBe('Bad Request')
              });
    });

    test('status: 404, comment_id does not exist', () => {
      return request(app)
              .delete('/api/comments/809135')
              .expect(404)
              .then(({ body }) => {
                const message = body.message;
                expect(message).toBe('Not Found')
              });
    });
  });
});