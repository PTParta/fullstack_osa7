import React from 'react'
import { useSelector } from 'react-redux'
import { Alert } from 'react-bootstrap'

const Notification = () => {

  const notification = useSelector(state => state.notification)


  /* const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  } */
  return (

    <div className='container'>
      {notification !== '' ?
        <div /* style={style} */>
          <Alert /* variant='success' */>
            {notification}
          </Alert>


        </div> :
        <div></div>}
    </div>

  )
}

export default Notification

/* import React from 'react'
import {useSelector} from 'react-redux'


const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

export default Notification */