import { SET_FARMING_CONTRACT_STEP, UPDATE_FARMING_CONTRACT, ADD_FARMING_SETUP, REMOVE_FARMING_SETUP } from '../../types';

const initialState = {
    farmingContract: null,
    farmingSetups: [],
    creationStep: 0,
}

export const sessionReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_FARMING_CONTRACT_STEP:
            return {
                ...state,
                creationStep: action.payload.step,
            }
        case UPDATE_FARMING_CONTRACT:
            return {
                ...state,
                farmingContract: action.payload.farmingContract,
            }
        case ADD_FARMING_SETUP:
            return {
                ...state,
                farmingSetups: [
                    ...state.farmingSetups, action.payload.farmingSetup
                ],
            }
        case REMOVE_FARMING_SETUP:
            return {
                ...state,
                farmingSetups: state.farmingSetups.filter((fs, i) => i !== action.payload.farmingSetupIndex),
            }
        default:
            return state;
    }
}