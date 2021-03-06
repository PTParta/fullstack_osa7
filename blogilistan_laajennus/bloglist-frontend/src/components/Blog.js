/* eslint-disable linebreak-style */
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Blog = ({ blog, likeBlog, user, remove }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const [showAll, setShowAll] = useState(false)

  const hideWhenVisible = { display: showAll ? 'none' : '' }
  const showWhenVisible = { display: showAll ? '' : 'none' }

  const handleClick = () => {
    setShowAll(!showAll)
  }

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
      < div /* style={blogStyle} */ className='blog'>
        <div id='blogShortView' style={hideWhenVisible} >
          <div className='blogTitleAndAuthor'>
            <Link to={`/blogs/${blog.id}`}>{blog.title}      </Link>
            {blog.author}
          </div>
          {/* <button onClick={handleClick}> view</button > */}
        </div>
        <div style={showWhenVisible} className='blogWhole'>
          {blog.title} {blog.author}<button onClick={handleClick}> hide</button >
          <div>{blog.url}</div>
          <div>likes {blog.likes} <button onClick={() => handleLikeClick(blog.id)}>like</button> </div>
          <div> {blog.user.name}</div>
          {user.username === blog.user.username ?
            <div><button onClick={() => handleRemoveClick(blog.id)}>remove</button></div> :
            <div></div>}
        </div>
      </div >
    </div>
  )
}

export default Blog
