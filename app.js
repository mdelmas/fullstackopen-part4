const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');

const blogsRouter = require('./controllers/blog');

mongoose.set('strictQuery', false);

const mongoUrl = config.MONGODB_URI;
logger.info('Connecting to ', mongoUrl);
mongoose.connect(mongoUrl)
  .then(() => logger.info('Connected to MongoDB'))
  .catch((error) => logger.error('Connected to MongoDB', error.message));

app.use(cors());
app.use(express.static('build'));
app.use(express.json());

app.use(middleware.requestLogger);

app.use('/api/blogs', blogsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;