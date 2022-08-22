import {createStore ,applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './reducers'
// import { persistStore, persistReducer } from 'redux-persist'
// import storage from 'redux-persist/lib/storage'

const initialState = {};
const middleware = [thunk];

// with storing redux data
// const persistConfig = {
//     key: 'root',
//     storage,
//   }
// const persistedReducer = persistReducer(persistConfig, rootReducer)
// const store = createStore(persistedReducer , initialState , composeWithDevTools(applyMiddleware(...middleware)))
// export const  persistor = persistStore(store)

// without storing redux data
const store = createStore(rootReducer , initialState , composeWithDevTools(applyMiddleware(...middleware)))

export default store;

