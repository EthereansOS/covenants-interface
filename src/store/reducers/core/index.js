import { 
    SET_DFO_CORE, 
    REMOVE_DFO_CORE, 
    ADD_PENDING_TRANSACTION, 
    REMOVE_PENDING_TRANSACTION,
    CLEAR_PENDING_TRANSACTIONS,
    SET_MAGIC_VISUAL_MODE
} from '../../types';

const initialState = {
    dfoCore: null,
    pendingTransactions: []
}

export const coreReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_DFO_CORE:
            return {
                ...state,
                dfoCore: action.payload,
            }
        case REMOVE_DFO_CORE:
            return {
                ...state,
                dfoCore: null,
            }
        case SET_MAGIC_VISUAL_MODE:
            return {
                ...state,
                magicMode: action.payload,
            }
        case ADD_PENDING_TRANSACTION:
            state.pendingTransactions.push(action.payload.transaction);
            return state;
        case REMOVE_PENDING_TRANSACTION:
            return {
                ...state,
                pendingTransactions: state.pendingTransactions.filter((t, i) => i !== action.payload.transactionIndex),
            }
        case CLEAR_PENDING_TRANSACTIONS:
            return {
                ...state,
                pendingTransactions: []
            }
        default:
            return state;
    }
}