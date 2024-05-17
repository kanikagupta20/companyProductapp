import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { ProductReducer } from "./Reducer";
import thunk from "redux-thunk";
import logger from "redux-logger";

const rootreducer=combineReducers({companyProducts:ProductReducer})
const compstore=configureStore({reducer:rootreducer,middleware:[thunk,logger]})
export default compstore;