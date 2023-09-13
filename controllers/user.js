const bcrypt = require('bcrypt');

const userRouter = require('express').Router();
const User = require('../models/user');

userRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1, id: 1 });
  return response.json(users);
});

userRouter.get('/:id', async (request, response) => {
  const user = await User.findById(request.params.id).populate('blogs', { url: 1, title: 1, author: 1, id: 1 });

  if (!user) {
    return response.status(404).json({
      message: 'Id not found'
    });
  }

  response.json(user);
});

userRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;

  if (!request.body.username || !request.body.password) {
    console.log('error 400, missing data');
    return response.status(400).json({
      message: 'Missing data...'
    });
  }

  console.log('password', password);
  const passwordHash = await bcrypt.hash(password, 10);
  console.log('passwordHash', passwordHash);

  const user = new User({ username, name, passwordHash });

  let result = await user.save();

  response.status(201).json(result);
});

module.exports = userRouter;
