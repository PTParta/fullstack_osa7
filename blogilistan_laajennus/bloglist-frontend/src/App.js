import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import { setNotification } from './reducers/notificationReducer'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs, createBlog, removeBlog, incrementVotesOf } from './reducers/blogReducer'
import { initializeUser } from './reducers/userReducer'

const App = () => {
  //const [blogs, setBlogs] = useState([])
  //const [errorMessage, setErrorMessage] = useState(null)
  //const [notificationMessage, setNotificationMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  //const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  const blogs = useSelector(state => {
    return state.blogs
    /* if (state.filter === '') {
      return state.anecdotes
    } else {
      return state.anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(state.filter.toLowerCase()))
    } */
  })

  const user = useSelector(state => {
    return state.user
  })



  /* useEffect(() => {
    dispatch(initializeAnecdotes())
  }, [dispatch]) */



  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(initializeUser(user))
      //setUser(user)
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
      //setUser(user)
      setUsername('')
      setPassword('')
    }
    catch (exception) {
      dispatch(setNotification('wrong username or password', 5))
      /* setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000) */
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    console.log('handling logout')
    window.localStorage.clear()
    dispatch(initializeUser(''))
    //setUser(null)
  }

  const create = (blogObject) => {
    //try {
    blogFormRef.current.toggleVisibility()
    /* blogService
      .create(blogObject)
      .then(returnedBlog => {
        returnedBlog.user = user */
    //setBlogs(blogs.concat(returnedBlog).sort((a, b) => b.likes - a.likes))
    blogObject.user = user
    console.log('user = ', user)
    console.log('blogObject = ', blogObject)
    dispatch(createBlog(blogObject))
    //  })
    dispatch(setNotification(`a new blog ${blogObject.title} by ${blogObject.author} added`, 5))
  } /* catch (exception) {
      dispatch(setNotification('an error occurred', 5)) */


  const likeBlog = (id) => {
    const blog = blogs.find(b => b.id === id)
    //console.log('blog before like')
    console.log('liked blog', blog)
    const likedBlog = { ...blog, likes: blog.likes + 1 }
    //console.log('blog after like')
    //console.log(likedBlog)
    dispatch(incrementVotesOf(id, likedBlog))
    /* blogService
      .update(id, likedBlog)
      .then(returnedBlog => { */
    //console.log('returned blog')
    //console.log(returnedBlog)
    //returnedBlog.user = likedBlog.user
    //console.log(returnedBlog)
    //setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog).sort((a, b) => b.likes - a.likes))
    /*  })
     .catch(() => {
       dispatch(setNotification(`Blog '${blog.title}' was already removed from server`, 5)) */
    /* setErrorMessage(
      `Blog '${blog.title}' was already removed from server`
    )
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000) */
    //})
  }

  //Tee remove reduxilla alla

  const remove = (id) => {
    console.log('removing blog with an id of: ', id)

    const blogToBeRemoved = blogs.filter(blog => blog.id === id)
    console.log('blogToBeRemoved', blogToBeRemoved)
    dispatch(removeBlog(blogToBeRemoved[0]))
    dispatch(setNotification(`blog ${blogToBeRemoved[0].title} by ${blogToBeRemoved[0].author} removed`, 5))
    /* try {
      blogService
        .remove(id)
        .then(() => {
          setBlogs(blogs.filter(blog => blog.id !== id))
        })
      dispatch(setNotification(`blog ${blogToBeRemoved[0].title} by ${blogToBeRemoved[0].author} removed`, 5))
    } catch (exception) {
      dispatch(setNotification('an error occurred', 5))
    } */
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

      <Togglable buttonLabel='new note' ref={blogFormRef}>
        <BlogForm user={user} create={create} /* removeBlog={removeBlog} */
        />
      </Togglable>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} likeBlog={likeBlog} user={user} remove={remove} />
      )}
    </div>
  )

  return (
    <div>
      {/*  <Notification message={errorMessage} />
      <Notification message={notificationMessage} /> */}
      <Notification />
      {user === '' ?
        loginForm() :
        <div>
          {(blogsListed())}
        </div>}
    </div>
  )
}

export default App