const logger = require('./logger');

const requestLogger = (request, response, next) => {
  if (request.path === '/json' || request.path === '/json/version') {
    return next();
  }

  logger.info(`${request.method} - ${request.path} : ${request.body}`);
  next();
};

const unknownEndpoint = ((request, response) => {
  response.status(404).send({ message: 'unknown endpoint' });
});

const errorHandler = (error, request, response, next) => {
  logger.error('Error: ', error.message);

  if (error.name === 'CastError') {
    return response.status(400).json({ message: 'Invalid id...' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ message: error.message });
  }

  next(error);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
};