const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  return response.json(blogs);
});

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    return response.status(404).json({
      message: 'Id not found'
    });
  }

  response.json(blog);
});

blogsRouter.post('/', async (request, response) => {
  if (!request.body.title || !request.body.url) {
    return response.status(400).json({
      message: 'Missing data...'
    });
  }

  const blog = new Blog(request.body);

  let result = await blog.save();
  response.status(201).json(result);
});

module.exports = blogsRouter;
