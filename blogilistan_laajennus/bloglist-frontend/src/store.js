import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
//import anecdoteReducer, {initializeAnecdotes} from './reducers/anecdoteReducer'
import notificationReducer from './reducers/notificationReducer'
//import filterReducer from './reducers/filterReducer'
//import blogService from './services/blogs'

const reducer = combineReducers({
  //anecdotes: anecdoteReducer,
  notification: notificationReducer,
  //filter: filterReducer
})

const store = createStore(
  reducer,
  composeWithDevTools(
    applyMiddleware(thunk)
  )
)

/* blogService.getAll().then(blogs =>
  store.dispatch(initializeAnecdotes(blogs))
) */

export default store