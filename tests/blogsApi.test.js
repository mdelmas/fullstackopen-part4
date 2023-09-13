const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');

const data = require('../utils/data');

const api = supertest(app);
let token = null;

beforeEach(async () => {
  await User.deleteMany({});

  const user = {
    username: 'x',
    password: 'x'
  };
  await api.post('/api/users').send(user);
  const result = await api.post('/api/login').send(user);
  token = result.body.token;

  await Blog.deleteMany({});

  for (let blog of data.initialBlogs) {
    blog.author = new mongoose.Types.ObjectId();
    await (new Blog(blog)).save();
  }
});

describe('Blogs API', () => {
  describe('Get all blogs', () => {
    test('returns results as a json', async () => {
      await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/);
    });

    test('returns corresponding number of blogs', async () => {
      const response = await api.get('/api/blogs');
      const returnedBlogs = response.body;

      expect(returnedBlogs.length).toBe(data.initialBlogs.length);
    });

    test('correctly formats id field of blog', async () => {
      const response = await api.get('/api/blogs');
      const firstBlog = response.body[0];

      expect(firstBlog.id).toBeDefined();
      expect(firstBlog._id).toBeUndefined();
      expect(firstBlog.__v).toBeUndefined();
    });
  });

  describe('Get blog by id', () => {
    test('returns results as a json', async () => {
      const response = await api.get('/api/blogs');
      const blogInDB = response.body[0];

      await api.get(`/api/blogs/${blogInDB.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);
    });

    test('returns correct blog', async () => {
      const response = await api.get('/api/blogs');
      const blogInDB = response.body[0];

      expect(blogInDB.title).toEqual(data.initialBlogs[0].title);
    });

    test('returns error if id does not exist', async () => {
      let newBlog = {
        title: 'Blog 1',
        url: 'blog.com',
        likes: 4
      };

      let result = await api.post('/api/blogs').send(newBlog)
        .set({ 'Authorization': `bearer ${token}` });
      let blogToDelete = result.body;

      let idToDelete = blogToDelete.id;

      await api.delete(`/api/blogs/${blogToDelete.id}`)
        .set({ 'Authorization': `bearer ${token}` });

      await api.get(`/api/blogs/${idToDelete}`)
        .expect(404);
    });

    test('returns error if id invalid', async () => {
      let invalidId = '5a3d5da59070081a82a3445';

      await api.get(`/api/blogs/${invalidId}`)
        .expect(400);
    });
  });

  describe('Create new blog', () => {
    test('returns results as a json', async () => {
      const newBlog = {
        title: 'Blog 1',
        url: 'blog.com',
        likes: 4
      };

      await api.post('/api/blogs')
        .send(newBlog)
        .set({ 'Authorization': `bearer ${token}` })
        .expect(201)
        .expect('Content-Type', /application\/json/);
    });

    test('add one blog in db', async () => {
      const newBlog = {
        title: 'Blog 1',
        url: 'blog.com',
        likes: 4
      };

      const response = await api.post('/api/blogs')
        .send(newBlog)
        .set({ 'Authorization': `bearer ${token}` });
      const blogInDB = response.body;
      expect(blogInDB.id).toBeDefined();

      const allBlogs = (await api.get('/api/blogs')).body;
      expect(allBlogs.length).toBe(data.initialBlogs.length+1);
    });

    test('set likes to 0 if not in the input', async () => {
      const newBlog = {
        title: 'Blog 1',
        url: 'blog.com'
      };

      const response = await api.post('/api/blogs')
        .send(newBlog)
        .set({ 'Authorization': `bearer ${token}` });
      const blogInDB = response.body;

      expect(blogInDB.likes).toBeDefined();
      expect(blogInDB.likes).toBe(0);
    });

    test('returns error if missing title or author', async () => {
      let newBlog = {
        title: 'Blog 1',
        likes: 4
      };

      await api.post('/api/blogs')
        .send(newBlog)
        .set({ 'Authorization': `bearer ${token}` })
        .expect(400);

      newBlog = {
        url: 'blog.com',
        likes: 4
      };

      await api.post('/api/blogs')
        .send(newBlog)
        .set({ 'Authorization': `bearer ${token}` })
        .expect(400);
    });
  });

  describe('Delete blog', () => {
    test('remove blog if id is valid', async () => {
      const newBlog = {
        title: 'Blog 1',
        url: 'blog.com',
        likes: 4
      };

      const response = await api.post('/api/blogs')
        .send(newBlog)
        .set({ 'Authorization': `bearer ${token}` });
      const blogToDelete = response.body;

      await api.delete(`/api/blogs/${blogToDelete.id}`)
        .set({ 'Authorization': `bearer ${token}` });

      const allBlogs = (await api.get('/api/blogs')).body;
      expect(allBlogs.length).toBe(data.initialBlogs.length);

      const allTitles = allBlogs.map(blog => blog.title);
      expect(allTitles).not.toContain(blogToDelete.title);
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});