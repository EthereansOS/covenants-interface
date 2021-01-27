import { SET_DFO_CORE, REMOVE_DFO_CORE } from '../../types';

export const setDFOCore = (dfoCore) => {
    return {
        type: SET_DFO_CORE,
        payload: dfoCore,
    }
}

export const removeDFOCore = () => {
    return {
        type: REMOVE_DFO_CORE,
    }
}