const listHelper = require('../utils/listHelper');

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
];

test('dummy returns 1', () => {
  expect(listHelper.dummy([])).toBe(1);
});

describe('totalLikes', () => {
  test('of empty array, is 0', () => {
    expect(listHelper.totalLikes([])).toBe(0);
  });

  test('of array with only one blog, is the number of likes of this post', () => {
    expect(listHelper.totalLikes([blogs[0]])).toBe(blogs[0].likes);
  });

  test('of bigger array, is the correct amount', () => {
    expect(listHelper.totalLikes(blogs)).toBe(36);
  });
});

describe('favoriteBlog', () => {
  test('of empty array, is null', () => {
    expect(listHelper.favoriteBlog([])).toEqual(null);
  });

  test('of array with only one blog, is this blog', () => {
    const favoriteBlog = listHelper.favoriteBlog([blogs[0]]);
    expect(favoriteBlog).toEqual(blogs[0]);
  });

  test('of bigger array, is the correct amount', () => {
    const favoriteBlog = listHelper.favoriteBlog(blogs);
    expect(favoriteBlog).toEqual(blogs[2]);
  });
});

describe('mostBlogs', () => {
  test('of empty array, is null', () => {
    expect(listHelper.mostBlogs([])).toEqual(null);
  });

  test('of array with only one blog, is this author with 1 blog', () => {
    const mostBlogs = listHelper.mostBlogs([blogs[0]]);
    expect(mostBlogs).toEqual({
      author: 'Michael Chan',
      blogs: 1
    });
  });

  test('of bigger array, find the correct result', () => {
    const mostBlogs = listHelper.mostBlogs(blogs);
    expect(mostBlogs).toEqual({
      author: 'Robert C. Martin',
      blogs: 3
    });
  });
});

describe('mostLikes', () => {
  test('of empty array, is null', () => {
    expect(listHelper.mostLikes([])).toEqual(null);
  });

  test('of array with only one blog, is this author with corresponding amount of likes', () => {
    const mostLikes = listHelper.mostLikes([blogs[0]]);
    expect(mostLikes).toEqual({
      author: 'Michael Chan',
      likes: 7
    });
  });

  test('of bigger array, find the correct result', () => {
    const mostLikes = listHelper.mostLikes(blogs);
    expect(mostLikes).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17
    });
  });
});