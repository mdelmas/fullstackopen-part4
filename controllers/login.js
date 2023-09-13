const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body;
  console.log(username, password);
  if (!username || !password) {
    return response.status(400).json({
      message: 'Missing data...'
    });
  }

  const user = await User.findOne({ username });
  const checkPassword = await bcrypt.compare(password, user.passwordHash);
  if (!checkPassword) {
    return response.status(401).json({
      error: 'Invalid username or password'
    });
  }

  const token = jwt.sign({
    id: user._id,
    username: user.username,
  }, process.env.SECRET);
  console.log(token);

  response.status(200).json({
    token,
    username: user.username,
    name: user.name
  });
});

module.exports = loginRouter;