const _ = require('lodash');

const dummy = () => {
  return 1;
};

const totalLikes = (blogs) => blogs
  .reduce((totalLikes, blog) => totalLikes + blog.likes, 0);

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  return blogs.reduce(
    (favoriteBlog, blog) => blog.likes > favoriteBlog.likes ? blog : favoriteBlog,
    blogs[0]
  );
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  let blogsCountByAuthors = _.countBy(blogs, blog => blog.author);
  let maxBlogsCount = _.max(Object.values(blogsCountByAuthors));
  let authorWithMaxBlogs = _.findKey(blogsCountByAuthors, count => maxBlogsCount === count);

  return {
    author: authorWithMaxBlogs,
    blogs: blogsCountByAuthors[authorWithMaxBlogs],
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  console.log(blogs);

  let likesByAuthors = _.reduce(blogs, (result, value) => {
    if (!result[value.author]) {
      result[value.author] = 0;
    }
    result[value.author] += value.likes;
    return result;
  }, {});
  let maxLikes = _.max(Object.values(likesByAuthors));
  let authorWithMaxLikes = _.findKey(likesByAuthors, likes => maxLikes === likes);

  return {
    author: authorWithMaxLikes,
    likes: maxLikes
  };

  // let blogsCountByAuthors = _.countBy(blogs, blog => blog.author);

  // return {
  //   author: authorWithMaxBlogs,
  //   blogs: blogsCountByAuthors[authorWithMaxBlogs],
  // };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};