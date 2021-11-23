import {applyMiddleware, combineReducers, createStore} from "redux";
import thunk from 'redux-thunk';

import employeesReducer from "./employeesReducer";

const reducers = combineReducers({
    employeesRed: employeesReducer,
});
const middleware = applyMiddleware(thunk)
const store = createStore(reducers, undefined, middleware);

export default store;