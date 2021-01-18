export const TOGGLE_DAPP_LAUNCH = 'TOGGLE_DAPP_LAUNCH';
export const SELECT_INDEX = 'SELECT_INDEX';

interface ToggleLaunchAction {
    type: typeof TOGGLE_DAPP_LAUNCH,
}

interface SelectIndexAction {
    type: typeof SELECT_INDEX,
    payload: number,
}

export interface SessionState {
    dappLaunched: boolean,
    selectedIndex: number,
}

export type SessionActionTypes = ToggleLaunchAction | SelectIndexAction;