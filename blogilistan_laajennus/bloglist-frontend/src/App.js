import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import Users from './components/Users'
import BlogForm from './components/BlogForm'
import SingleBlog from './components/SingleBlog'
import blogService from './services/blogs'
import loginService from './services/login'
import { setNotification } from './reducers/notificationReducer'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs, createBlog, removeBlog, incrementVotesOf } from './reducers/blogReducer'
import { initializeUser } from './reducers/userReducer'
import {
  //BrowserRouter as Router,
  Switch,
  Route,
  Link,
  //Redirect,
  useRouteMatch,
  //useHistory
} from 'react-router-dom'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const blogFormRef = useRef()

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  const blogs = useSelector(state => {
    return state.blogs
  })

  const user = useSelector(state => {
    return state.user
  })

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(initializeUser(user))
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)

      dispatch(initializeUser(user))
      setUsername('')
      setPassword('')
    }
    catch (exception) {
      dispatch(setNotification('wrong username or password', 5))
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    console.log('handling logout')
    window.localStorage.clear()
    dispatch(initializeUser(''))
  }

  const create = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogObject.user = user
    console.log('user = ', user)
    console.log('blogObject = ', blogObject)
    dispatch(createBlog(blogObject))
    dispatch(setNotification(`a new blog ${blogObject.title} by ${blogObject.author} added`, 5))
  }


  const likeBlog = (id) => {
    const blog = blogs.find(b => b.id === id)
    console.log('liked blog', blog)
    const likedBlog = { ...blog, likes: blog.likes + 1 }
    dispatch(incrementVotesOf(id, likedBlog))

  }

  const remove = (id) => {
    console.log('removing blog with an id of: ', id)

    const blogToBeRemoved = blogs.filter(blog => blog.id === id)
    console.log('blogToBeRemoved', blogToBeRemoved)
    dispatch(removeBlog(blogToBeRemoved[0]))
    dispatch(setNotification(`blog ${blogToBeRemoved[0].title} by ${blogToBeRemoved[0].author} removed`, 5))
  }

  const loginForm = () => (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            id='username'
            type='text'
            value={username}
            name='Username'
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            id='password'
            type='password'
            value={password}
            name='Password'
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id='login-button' type='submit'>
          login
        </button>
      </form>
    </div>
  )

  const blogsListed = () => (
    <div>
      <h2>blogs</h2>
      <table>
        <tbody>
          <tr>
            <td>{user.name} logged in </td>
            <td><button onClick={handleLogout}>logout</button></td>
          </tr>
        </tbody>
      </table>

      <Togglable buttonLabel='create new' ref={blogFormRef}>
        <BlogForm user={user} create={create}
        />
      </Togglable>
      <Switch>
        <Route path='/blogs/:id'>
          <SingleBlog blog={blogMatch} likeBlog={likeBlog} user={user} remove={remove}/>
        </Route>


        <Route path='/'>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} likeBlog={likeBlog} user={user} remove={remove} />
          )}
        </Route>
      </Switch>
    </div>
  )

  const padding = {
    padding: 5
  }

  const match = useRouteMatch('/blogs/:id')

  console.log('match', match)
  //console.log('match.params.id', match.params.id)
  const blogMatch = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

  return (
    <div>
      <div>
        <Link style={padding} to='/users'>users</Link>
        <Link style={padding} to='/blogs'>blogs</Link>
      </div>
      <Notification />
      {/* {user === '' ?
        loginForm() :
        <div>
          {(blogsListed())}
        </div>} */}
      <Switch>
        <Route path='/users'>
          <Users />
        </Route>
        <Route path='/'>
          {user === '' ?
            loginForm() :
            <div>
              {(blogsListed())}
            </div>}
        </Route>
      </Switch>
    </div>
  )
}

export default App