import React from 'react'

const User = ({ user }) => {
  if (!user) {
    return (
      <div>not working</div>
    )
  }
  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      {user.blogs.map(blog =>
        < ul key={blog.id}>
          <li>{blog.title}</li>
        </ul>
      )}
    </div >
  )
}
export default User