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

export const setFarmingContractStep = (step) => {
    return {
        type: SET_FARMING_CONTRACT_STEP,
        payload: { step },
    }
}

export const updateFarmingContract = (farmingContract) => {
    return {
        type: UPDATE_FARMING_CONTRACT,
        payload: { farmingContract },
    }
}

export const addFarmingSetup = (farmingSetup) => {
    return {
        type: ADD_FARMING_SETUP,
        payload: { farmingSetup },
    }
}

export const removeFarmingSetup = (farmingSetupIndex) => {
    return {
        type: REMOVE_FARMING_SETUP,
        payload: { farmingSetupIndex },
    }
}

export const setInflationContractStep = (step) => {
    return {
        type: SET_INFLATION_CONTRACT_STEP,
        payload: { step },
    }
}

export const updateInflationContract = (inflationContract) => {
    return {
        type: UPDATE_INFLATION_CONTRACT,
        payload: { inflationContract },
    }
}

export const addEntry = (entry) => {
    return {
        type: ADD_ENTRY,
        payload: { entry },
    }
}

export const removeEntry = (entryIndex) => {
    return {
        type: REMOVE_ENTRY,
        payload: { entryIndex },
    }
}

