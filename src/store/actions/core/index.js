import { 
    SET_DFO_CORE, 
    REMOVE_DFO_CORE, 
    ADD_TRANSACTION, 
    REMOVE_TRANSACTION,
    CLEAR_TRANSACTIONS,
    SET_MAGIC_VISUAL_MODE,
    TOGGLE_SIDEMENU,
} from '../../types';

export const setDFOCore = (dfoCore) => {
    return {
        type: SET_DFO_CORE,
        payload: dfoCore,
    }
}

export const removeDFOCore = () => {
    return {
        type: REMOVE_DFO_CORE,
    }
}

export const setMagicVisualMode = () => {
    return {
        type: SET_MAGIC_VISUAL_MODE,
        payload: true
    }
}

export const removeMagicVisualMode = () => {
    return {
        type: SET_MAGIC_VISUAL_MODE,
        payload: false
    }
}

export const addTransaction = (transaction) => {
    return {
        type: ADD_TRANSACTION,
        payload: { transaction },
    }
}

export const removeTransaction = (transactionIndex) => {
    return {
        type: REMOVE_TRANSACTION,
        payload: { transactionIndex },
    }
}

export const clearTransactions = () => {
    return {
        type: CLEAR_TRANSACTIONS,
    }
}

export const toggleSidemenu = () => {
    return {
        type: TOGGLE_SIDEMENU
    }
}