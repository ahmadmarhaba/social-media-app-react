import {createStore ,applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './reducers'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const initialState = {};
const middleware = [thunk];
const persistConfig = {
    key: 'root',
    storage,
  }
const persistedReducer = persistReducer(persistConfig, rootReducer)
const store = createStore(persistedReducer , initialState , composeWithDevTools(applyMiddleware(...middleware)))
export const  persistor = persistStore(store)
export default store;
