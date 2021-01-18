import { TOGGLE_DAPP_LAUNCH, SELECT_INDEX } from '../../types';

export function toggleDappLaunch() {
    return {
        type: TOGGLE_DAPP_LAUNCH,
    }
}

export function selectIndex(index) {
    return {
        type: SELECT_INDEX,
        payload: index,
    }
}