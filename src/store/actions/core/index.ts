import { SET_DFO_CORE, REMOVE_DFO_CORE, DFOCoreActionTypes } from '../../types';

export function setDFOCore(dfoCore: any): DFOCoreActionTypes {
    return {
        type: SET_DFO_CORE,
        payload: dfoCore,
    }
}

export function removeDFOCore(): DFOCoreActionTypes {
    return {
        type: REMOVE_DFO_CORE,
    }
}