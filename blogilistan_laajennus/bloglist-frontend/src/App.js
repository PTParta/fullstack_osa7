import React, { useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import Users from './components/Users'
import BlogForm from './components/BlogForm'
import SingleBlog from './components/SingleBlog'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
/* import loginService from './services/login' */
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
  Redirect,
  //useHistory
} from 'react-router-dom'
import { Table, Navbar, Nav } from 'react-bootstrap'

const App = () => {
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

  const blogsListed = () => (
    <div>
      <h2>blogs</h2>
      <table>
        <tbody>
          <tr>
          </tr>
        </tbody>
      </table>

      <Togglable buttonLabel='create new' ref={blogFormRef}>
        <BlogForm user={user} create={create}
        />
      </Togglable>
      <Switch>
        <Route path='/blogs/:id'>
          <SingleBlog blog={blogMatch} likeBlog={likeBlog} user={user} remove={remove} />
        </Route>


        <Route path='/'>
          <Table striped>
            <tbody>
              {blogs.map(blog =>
                <tr key={blog.id}>
                  <td><Blog blog={blog} likeBlog={likeBlog} user={user} remove={remove} /></td>
                  <td>{blog.author}</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Route>
      </Switch>
    </div>
  )

  const padding = {
    padding: 5
  }

  const match = useRouteMatch('/blogs/:id')

  console.log('match', match)
  const blogMatch = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

  return (
    <div className="container">


      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            {/* <Nav.Link href="#" as="span">
              <Link style={padding} to="/">home</Link>
            </Nav.Link> */}
            <Nav.Link href="#" as="span">
              <Link style={padding} to="/users">users</Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              <Link style={padding} to="/blogs">blogs</Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              {user
                ? <div>
                  <em>{user.name} logged in      </em>
                  <button onClick={handleLogout}>logout</button>
                </div>
                : <Link to="/login">login</Link>
              }
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* <div>
        {user ? <div>
          <Link style={padding} to='/users'>users</Link>
          <Link style={padding} to='/blogs'>blogs</Link>
          {user.name} logged in
          <button onClick={handleLogout}>logout</button>
        </div> :
          <div></div>}

      </div> */}
      <Notification />
      <Switch>
        <Route path='/login'>
          <LoginForm />
        </Route>
        <Route path='/users'>
          {user ? <Users /> : <Redirect to='/login' />}
        </Route>
        <Route path='/blogs'>
          {user ? blogsListed() : <Redirect to='/login' />}
        </Route>
        <Route path='/'>
          {user ? blogsListed() : <Redirect to='/login' />}
        </Route>
      </Switch>
    </div>
  )
}

export default App