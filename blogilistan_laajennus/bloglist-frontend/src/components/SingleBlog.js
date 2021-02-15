import { Redirect } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import commentService from '../services/comments'

const SingleBlog = ({ blog, likeBlog, user, remove }) => {

  const [comments, setComments] = useState([])
  const [newCommentContent, setNewCommentContent] = useState('')

  useEffect(() => {
    commentService.getAll().then((response) => {
      console.log('response', response)
      const allComments = response
      const blogComments = allComments.filter(comment => comment.blog === blog.id)
      setComments(blogComments)
    })
  }, [])

  const handleLikeClick = (id) => {
    likeBlog(id)
  }

  const handleRemoveClick = (id) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      remove(id)
    }
  }

  const addComment = async (event) => {
    event.preventDefault()

    const newComment = {
      content: newCommentContent,
      blog: blog.id
    }

    const newComments = await commentService.create(newComment)
    console.log('newComments', newComments)
    /* setComments(newComments.map(comment => comme)) */
    setComments([...comments, newComments])
    setNewCommentContent('')
  }

  return (
    <div>
      {blog ? <div>
        <h2>{blog.title}</h2>
        <a href={blog.url}>{blog.url}</a>
        {/* <p>{blog.url}</p> */}
        <div>{blog.likes} likes <button onClick={() => handleLikeClick(blog.id)}>like</button></div>
        <p>added by {blog.user.name}</p>
        {user.username === blog.user.username ?
          <div><button onClick={() => handleRemoveClick(blog.id)}>remove</button></div> :
          <div></div>}
      </div> :
        <Redirect to="/blogs" />}
      <h3>comments</h3>

      <form onSubmit={addComment}>
        <div>
          title:
          <input
            id='comment'
            type="text"
            value={newCommentContent}
            name="newTitleCommentContent"
            onChange={({ target }) => setNewCommentContent(target.value)}
          />
        </div>
        <div>
          <button id='createblog' type="submit">
            comment
          </button></div>
      </form>

      {comments.map(comment =>
        <ul key={comment.id}>
          <li>{comment.content}</li>
        </ul>)}
    </div >
  )
}
export default SingleBlog