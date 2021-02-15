const commentsRouter = require('express').Router()
const Blog = require('../models/blog.js')
//const User = require('../models/user.js')
const Comment = require('../models/comment.js')
//const jwt = require('jsonwebtoken')

commentsRouter.get('/:id/comments', async (request, response) => {
  /* This finds all the comments from all the blogs. Better way would be to find by the :id but couldn't
  find out how to do that */
  const comments = await Comment.find({})/* .populate('blog', { title: 1, author: 1, url: 1, id: 1 }) */
  console.log('comments', comments)
  response.json(comments)
})

commentsRouter.post('/:id/comments', async (request, response) => {

  //const user = await User.findById(request.body.userId)

  //const token = getTokenFrom(request)

  console.log('posting a comment')
  /* console.log('request.params', request.params)
  console.log('request', request) */

  /* const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  } */
  const blog = await Blog.findById(request.body.blog)

  console.log('blog', blog)

  let comment
  comment = new Comment(request.body)
  comment.blog = blog._id
  console.log('comment', comment)

  if (comment.content === '') {
    response.status(400).json(comment.toJSON())
    console.log('comment.content === ""')
  } else {
    const savedComment = await comment.save()
    console.log('saved comment', savedComment)
    blog.comments = blog.comments.concat(savedComment._id)
    console.log('blog.comments', blog.comments)
    await blog.save()
    response.json(savedComment.toJSON())
  }
})



module.exports = commentsRouter