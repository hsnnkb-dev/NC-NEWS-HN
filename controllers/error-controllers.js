exports.handle404Errors = (request, response, next) => {
  response.status(404).send({ message: 'Not Found'})
}

exports.handleServerErrors = (err, request, response, next) => {
  console.log(err);
  response.status(500).send({ message: 'Internal Server Error!' });
}