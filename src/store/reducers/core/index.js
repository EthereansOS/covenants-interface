import { SET_DFO_CORE, REMOVE_DFO_CORE } from '../../types';

const initialState = {
    dfoCore: null,
}

export function coreReducer(state = initialState, action) {
    switch (action.type) {
        case SET_DFO_CORE:
            return {
                dfoCore: action.payload,
            }
        case REMOVE_DFO_CORE:
            return {
                dfoCore: null,
            }
        default:
            return state;
    }
}