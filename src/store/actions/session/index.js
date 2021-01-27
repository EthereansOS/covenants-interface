import { SET_FARMING_CONTRACT_STEP, UPDATE_FARMING_CONTRACT, ADD_FARMING_SETUP, REMOVE_FARMING_SETUP } from '../../types';

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
