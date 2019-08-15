import {combineReducers, createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import userReducer from './reducers/user';
import searchSettings from './reducers/searchSettings';

const reducers = combineReducers({
    user: userReducer,
    searchSettings: searchSettings
});

const store = createStore(reducers, applyMiddleware(thunk));

export default store;