import { TOGGLE_DAPP_LAUNCH, SELECT_INDEX, SessionActionTypes, SessionState } from '../../types';

const initialState: SessionState = {
    dappLaunched: false,
    selectedIndex: 0,
}

export function sessionReducer(state = initialState, action: SessionActionTypes): SessionState {
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