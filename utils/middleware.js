const logger = require('./logger');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const requestLogger = (request, response, next) => {
  if (request.path === '/json' || request.path === '/json/version') {
    return next();
  }

  logger.info(`${request.method} - ${request.path} : ${JSON.stringify(request.body)}`);
  next();
};

const unknownEndpoint = ((request, response) => {
  response.status(404).send({ message: 'unknown endpoint' });
});

const errorHandler = (error, request, response, next) => {
  logger.error('Error: ', error.name, error.message);

  if (error.name === 'CastError') {
    return response.status(400).json({ message: 'Invalid id...' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ message: error.message });
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ message: error.message });
  }

  next(error);
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('bearer ')) {
    request.token = authorization.replace('bearer ', '');
  }
  next();
};

const userExtractor = async (request, response, next) => {
  const decodedToken = request.token ? jwt.verify(request.token, process.env.SECRET) : null;
  if (!decodedToken || !decodedToken.id) {
    return response.status(401).json({ message: 'token invalid' });
  }

  request.author = await User.findById(decodedToken.id);
  next();
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
};