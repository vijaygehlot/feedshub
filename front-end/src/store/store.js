import { createStore } from 'redux';
import userReducer from '../reducer/userReducer';

const initialState = {}

const store = createStore(
    userReducer,
    initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export default store