/* eslint-disable indent */
/*This reducer handles the data of all the blog app users so itś
easy to access data each user has*/
import userService from '../services/users'

const usersAtStart = []

const allUsersReducer = (state = usersAtStart, action) => {
  switch (action.type) {
    case 'INIT_USERS':
      return action.data
    default:
      return state
  }
}

export const initializeUsers = () => {
  return async dispatch => {
    const users = await userService.getAll()
    dispatch({
      type: 'INIT_USERS',
      data: users
    })
  }
}

export default allUsersReducer