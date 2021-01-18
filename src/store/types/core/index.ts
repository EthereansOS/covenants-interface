import DFOCore from "../../../core";

export const SET_DFO_CORE = 'SET_DFO_CORE';
export const REMOVE_DFO_CORE = 'REMOVE_DFO_CORE';

export interface SetDFOPayload {
    dfoCore: DFOCore,
}

interface SetDFOCoreAction {
    type: typeof SET_DFO_CORE,
    payload: DFOCore,
}

interface RemoveDFOCoreAction {
    type: typeof REMOVE_DFO_CORE,
}

export interface DFOCoreState {
    dfoCore: DFOCore | null,
}

export type DFOCoreActionTypes = SetDFOCoreAction | RemoveDFOCoreAction;