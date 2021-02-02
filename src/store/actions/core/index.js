import { 
    SET_DFO_CORE, 
    REMOVE_DFO_CORE, 
    ADD_PENDING_TRANSACTION, 
    REMOVE_PENDING_TRANSACTION,
    CLEAR_PENDING_TRANSACTIONS
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

export const addPendingTransaction = (transaction) => {
    return {
        type: ADD_PENDING_TRANSACTION,
        payload: { transaction },
    }
}

export const removePendingTransaction = (transactionIndex) => {
    return {
        type: REMOVE_PENDING_TRANSACTION,
        payload: { transactionIndex },
    }
}

export const clearPendingTransactions = () => {
    return {
        type: CLEAR_PENDING_TRANSACTIONS,
    }
}