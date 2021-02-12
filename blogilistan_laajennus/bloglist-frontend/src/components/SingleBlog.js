import React from 'react'
import { Redirect } from 'react-router-dom'

const SingleBlog = ({ blog, likeBlog, user, remove }) => {

  const handleLikeClick = (id) => {
    likeBlog(id)
  }

  const handleRemoveClick = (id) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      remove(id)
    }

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
    </div >
  )
}
export default SingleBlog