import { combineReducers } from '@reduxjs/toolkit';
import { coreReducer } from './core';
import { sessionReducer } from './session';

const rootReducer = combineReducers({
    core: coreReducer, 
    session: sessionReducer,
});

export default rootReducer;