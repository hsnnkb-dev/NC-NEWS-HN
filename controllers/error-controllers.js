exports.handleServerErrors = (err, request, response, next) => {
  console.log(err);
  response.status(500).send({ message: 'Internal Server Error!' });
}