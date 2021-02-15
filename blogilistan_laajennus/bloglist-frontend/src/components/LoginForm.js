import loginService from '../services/login'
import blogService from '../services/blogs'
import React, { useState } from 'react'
import { initializeUser } from '../reducers/userReducer'
import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { Redirect } from 'react-router-dom'

const LoginForm = () => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const user = useSelector(state => {
    return state.user
  })

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

  return (
    <div>
      {user ? <Redirect to='/blogs' /> :
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
        </div>}
    </div>
  )
}

export default LoginForm