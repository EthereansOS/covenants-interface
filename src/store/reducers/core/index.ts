import { SET_DFO_CORE, REMOVE_DFO_CORE, DFOCoreActionTypes, DFOCoreState } from '../../types';

const initialState: DFOCoreState = {
    dfoCore: null,
}

export function coreReducer(state = initialState, action: DFOCoreActionTypes): DFOCoreState {
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