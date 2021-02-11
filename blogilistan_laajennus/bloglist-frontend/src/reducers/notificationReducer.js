const notificationAtStart = ''

const notificationReducer = (state = notificationAtStart, action) => {
  switch (action.type) {
    case 'NOTIFY':
      return action.data
    case 'CLOSE_NOTIFICATION':
      return notificationAtStart
    default:
      return state
  }
}

let timeout
export const setNotification = (notification, time) => {
  return async dispatch => {
    dispatch({
      type: 'NOTIFY',
      data: notification
    })

    console.log('timeout is', timeout)
    if (timeout) {
      console.log('Clearing timeout')
      clearTimeout(timeout)
      timeout = null
    }
    timeout = setTimeout(() => {
      dispatch(hideNotification())
    }, 1000 * time)
  }
}

export const hideNotification = () => {
  return {
    type: 'CLOSE_NOTIFICATION',
  }
}

export default notificationReducer