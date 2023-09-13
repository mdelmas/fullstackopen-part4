const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/user');

const data = require('../utils/data');

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});

  for (let user of data.initialUsers) {
    await api.post('/api/users').send(user);
  }
});

describe('Users API', () => {
  describe('Get all users', () => {
    test('returns results as a json', async () => {
      await api.get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/);
    });

    test('returns corresponding number of users', async () => {
      const response = await api.get('/api/users');
      const returnedUsers = response.body;

      expect(returnedUsers.length).toBe(data.initialUsers.length);
    });
  });

  describe('Create new user', () => {
    test('returns results as a json', async () => {
      const newUser = {
        username: 'newuser',
        name: 'User New',
        password: 'passwordnew'
      };

      await api.post('/api/users').send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/);
    });

    test('add one user in db', async () => {
      const newUser = {
        username: 'newuser',
        name: 'User New',
        password: 'passwordnew'
      };

      const response = await api.post('/api/users').send(newUser);
      const userInDB = response.body;
      expect(userInDB.id).toBeDefined();

      const allUsers = (await api.get('/api/users')).body;
      expect(allUsers.length).toBe(data.initialUsers.length+1);
    });

    test('returns error if missing password or username', async () => {
      let newUser = {
        name: 'User New',
        password: 'passwordnew'
      };

      await api.post('/api/users').send(newUser)
        .expect(400);

      newUser = {
        username: 'newuser',
        name: 'User New',
      };

      await api.post('/api/users').send(newUser)
        .expect(400);
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});