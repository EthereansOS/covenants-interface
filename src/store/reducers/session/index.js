import { 
    SET_FARMING_CONTRACT_STEP, 
    UPDATE_FARMING_CONTRACT, 
    ADD_FARMING_SETUP, 
    REMOVE_FARMING_SETUP,
    SET_INFLATION_CONTRACT_STEP,
    UPDATE_INFLATION_CONTRACT,
    ADD_ENTRY,
    REMOVE_ENTRY
} from '../../types';

const initialState = {
    farmingContract: null,
    farmingSetups: [],
    creationStep: 0,
    inflationContract: null,
    entries: [],
    inflationCreationStep: 0
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
            state.farmingSetups.push(action.payload.farmingSetup);
            return state;
        case REMOVE_FARMING_SETUP:
            return {
                ...state,
                farmingSetups: state.farmingSetups.filter((fs, i) => i !== action.payload.farmingSetupIndex),
            }
        case SET_INFLATION_CONTRACT_STEP:
            return {
                ...state,
                inflationCreationStep: action.payload.step,
            }
        case UPDATE_INFLATION_CONTRACT:
            return {
                ...state,
                inflationContract: action.payload.inflationContract,
            }
        case ADD_ENTRY:
            state.entries.push(action.payload.entry);
            return state;
        case REMOVE_ENTRY:
            return {
                ...state,
                entries: state.entries.filter((e, i) => i !== action.payload.entryIndex),
            }
        default:
            return state;
    }
}