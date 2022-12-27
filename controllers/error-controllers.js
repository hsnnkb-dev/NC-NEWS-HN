/*
 *  Error-handling logic for all endpoints.
 *  Handles errors to give the appropriate response based on
 *  the errors origin. Passes to the next middleware until error
 *  is correctly handled.
*/

exports.handle404Errors = (request, response, next) => {
  response.status(404).send({ message: 'Not Found'})
}

exports.handleCustomErrors = (err, request, response, next) => {
  (err.status && err.message) ? 
    response.status(err.status).send({ message: err.message }) :
    next(err);
}

exports.handlePsqlErrors = (err, request, response, next) => {
  if (err.code === '23503') {
    response.status(404).send({ message : 'Not Found' });
  } else if (err.code === '23502' || err.code === '22P02') {
    response.status(400).send({ message : 'Bad Request' })
  } else {
    next(err)
  }	
}

exports.handleServerErrors = (err, request, response, next) => {
  console.log(err);
  response.status(500).send({ message: 'Internal Server Error!' });
}