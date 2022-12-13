exports.handle404Errors = (request, response, next) => {
  response.status(404).send({ message: 'Not Found'})
}

exports.handlePsqlErrors = (err, request, response, next) => { 
	(err.code === '23502' || err.code === '22P02' || err.code === '23503') ?
		response.status(400).send({ message : 'Bad Request' }) :
		next(err)
}

exports.handleServerErrors = (err, request, response, next) => {
  console.log(err);
  response.status(500).send({ message: 'Internal Server Error!' });
}