/* eslint-disable indent */
const userAtStart = ''

const userReducer = (state = userAtStart, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.data
    default:
      return state
  }
}

export const initializeUser = (user) => {
  return dispatch => {
    dispatch({
      type: 'SET_USER',
      data: user
    })
  }
}
export default userReducer