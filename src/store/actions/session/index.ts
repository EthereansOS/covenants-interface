import { TOGGLE_DAPP_LAUNCH, SELECT_INDEX, SessionActionTypes } from '../../types';

export function toggleDappLaunch(): SessionActionTypes {
    return {
        type: TOGGLE_DAPP_LAUNCH,
    }
}

export function selectIndex(index: number): SessionActionTypes {
    return {
        type: SELECT_INDEX,
        payload: index,
    }
}