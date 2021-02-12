import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { initializeUsers } from '../reducers/allUsersReducer'
import { Link, Switch, Route, useRouteMatch } from 'react-router-dom'
import User from './User'

const Users = () => {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeUsers())
  }, [dispatch])

  const users = useSelector(state => {
    return state.users
  })


  console.log('users0', users)

  const match = useRouteMatch('/users/:id')

  console.log('match', match)
  //console.log('match.params.id', match.params.id)
  const userMatch = match
    ? users.find(user => user.id === match.params.id)
    : null

  console.log('users 1', users)

  return (
    <div>
      <Switch>
        <Route path='/users/:id'>
          <User user={userMatch} />
        </Route>
        <Route path='/users'>
          <h2>Users</h2>
          <table>
            <tbody style={{ textAlign: 'left' }}>
              <tr>
                <th></th>
                <th >blogs created</th>
              </tr>
              {users.map(user =>
                <tr key={user.id}>
                  <th>
                    <Link to={`/users/${user.id}`}>{user.name}</Link>
                  </th>
                  <th>{user.blogs.length}</th>
                </tr>
              )}
            </tbody>
          </table>
        </Route>
      </Switch>
    </div>
  )
}

export default Users

/*   const blogs = useSelector(state => {
    return state.blogs
  })
  const users = []
  blogs.forEach(blog => {
    console.log('blog.user.name', blog.user.name)
    if (!users.some(user => user.username === blog.user.username)) {
      users.push(blog.user)
    }
  })
  users.forEach(user => {
    const usersBlogs = blogs.filter(blog => blog.user.username === user.username)
    user.numberOfBlogs = usersBlogs.length
  }) */

/* {blogs.map(blog =>
  <Blog key={blog.id} blog={blog} likeBlog={likeBlog} user={user} remove={remove} />
)} */