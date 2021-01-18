import { TOGGLE_DAPP_LAUNCH, SELECT_INDEX } from '../../types';

const initialState = {
    dappLaunched: false,
    selectedIndex: 0,
}

export function sessionReducer(state = initialState, action) {
    switch (action.type) {
        case TOGGLE_DAPP_LAUNCH:
            return {
                ...state,
                dappLaunched: !state.dappLaunched,
            }
        case SELECT_INDEX:
            return {
                ...state,
                selectedIndex: action.payload,
            }
        default:
            return state;
    }
}