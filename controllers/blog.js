const mongoose = require('mongoose');
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
// const User = require('../models/user');
const middleware = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('author', { username: 1, name: 1, id: 1 });
  return response.json(blogs);
});

blogsRouter.get('/:id', async (request, response) => {
  console.log('in get :id', request.params);
  const blog = await Blog.findById(request.params.id).populate('author', { username: 1, name: 1, id: 1 });
  console.log('blog', blog);

  if (!blog) {
    return response.status(404).json({
      message: 'Id not found'
    });
  }

  response.json(blog);
});

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  if (!request.body.title || !request.body.url) {
    return response.status(400).json({
      message: 'Missing data...'
    });
  }

  const blog = new Blog({
    title: request.body.title,
    author: request.author.id,
    url: request.body.title,
    likes: request.body.likes,
  });
  let savedBlog = await blog.save();
  savedBlog.populate('author', { username: 1, name: 1, id: 1 });

  request.author.blogs = request.author.blogs.concat(savedBlog._id);
  await request.author.save();

  response.status(201).json(savedBlog);
});

blogsRouter.put('/:id', middleware.userExtractor, async (request, response) => {
  const blog = request.body;

  blog.author = new mongoose.Types.ObjectId(blog.author);
  await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });

  return response.status(200).end();
});

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (request.author._id.toString() !== blog.author.toString()) {
    return response.status(401).json({ message: 'action not allowed' });
  }

  await Blog.findByIdAndRemove(request.params.id);
  return response.status(204).end();
});

module.exports = blogsRouter;
