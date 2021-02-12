/* eslint-disable indent */
import blogService from '../services/blogs'

const blogReducer = (state = [], action) => {
  console.log('state now: ', state)
  console.log('action', action)

  switch (action.type) {
    case 'CREATE_BLOG':
      return [...state, action.data]

    case 'VOTE': {
      const id = action.data.id
      const blogToChange = state.find(n => n.id === id)
      const changedBlog = {
        ...blogToChange,
        likes: blogToChange.likes + 1
      }
      return state.map(blog => blog.id !== id ? blog : changedBlog).sort((a, b) => b.likes - a.likes)
    }
    case 'INIT_BLOGS':
      return action.data.sort((a, b) => b.likes - a.likes)

    case 'REMOVE_BLOG':
      return state.filter(b => b.id !== action.data.id)

    default:

      return state
  }
}

export const createBlog = (content) => {
  return async dispatch => {
    const newBlog = await blogService.create(content)
    dispatch({
      type: 'CREATE_BLOG',
      data: newBlog
    })
  }
}

export const removeBlog = (content) => {
  return async dispatch => {
    await blogService.remove(content.id)
    dispatch({
      type: 'REMOVE_BLOG',
      data: content
    })
  }
}

export const incrementVotesOf = (id, content) => {
  return async dispatch => {
    await blogService.update(id, content)
    dispatch({
      type: 'VOTE',
      data: content
    })
  }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs
    })
  }
}

export default blogReducer