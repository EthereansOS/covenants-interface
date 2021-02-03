import { 
    SET_FARMING_CONTRACT_STEP, 
    UPDATE_FARMING_CONTRACT, 
    ADD_FARMING_SETUP, 
    REMOVE_FARMING_SETUP,
    ADD_INFLATION_SETUP,
    REMOVE_INFLATION_SETUP,
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
    inflationSetups: [],
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
            return {
                ...state,
                farmingSetups: state.farmingSetups.concat(action.payload.farmingSetup),
            };
        case REMOVE_FARMING_SETUP:
            return {
                ...state,
                farmingSetups: state.farmingSetups.filter((fs, i) => i !== action.payload.farmingSetupIndex),
            }
        case ADD_INFLATION_SETUP:
            return {
                ...state,
                inflationSetups: state.inflationSetups.concat(action.payload.inflationSetup),
            };
        case REMOVE_INFLATION_SETUP:
            return {
                ...state,
                inflationSetups: state.inflationSetups.filter((fs, i) => i !== action.payload.inflationSetupIndex),
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
            const addEntrySetups = state.inflationSetups.map((setup, index) => {
                if (index === action.payload.setupIndex) {
                    return {
                        ...setup,
                        entries: setup.entries.concat(action.payload.entry),
                    }
                }
                return setup;
            })
            return {
                ...state,
                inflationSetups: addEntrySetups
            };
        case REMOVE_ENTRY:
            const removeEntrySetups = state.inflationSetups.map((setup, index) => {
                if (index === action.payload.setupIndex) {
                    return {
                        ...setup,
                        entries: setup.entries.filter((_, i) => i !== index),
                    }
                }
                return setup;
            })
            return {
                ...state,
                inflationSetups: removeEntrySetups,
            }
        default:
            return state;
    }
}