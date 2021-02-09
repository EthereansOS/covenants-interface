import { 
    SET_DFO_CORE, 
    REMOVE_DFO_CORE, 
    ADD_TRANSACTION, 
    REMOVE_TRANSACTION,
    CLEAR_TRANSACTIONS,
    SET_MAGIC_VISUAL_MODE,
    TOGGLE_SIDEMENU
} from '../../types';

const initialState = {
    dfoCore: null,
    transactions: [],
    sidemenuClass: '',
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
        case ADD_TRANSACTION:
            return {
                ...state,
                transactions: state.transactions.concat(action.payload.transaction),
            }
        case REMOVE_TRANSACTION:
            return {
                ...state,
                transactions: state.transactions.filter((t, i) => i !== action.payload.transactionIndex),
            }
        case CLEAR_TRANSACTIONS:
            return {
                ...state,
                transactions: []
            }
        case TOGGLE_SIDEMENU:
            return {
                ...state,
                sidemenuClass: state.sidemenuClass === '' ? 'sidemenu-active' : '',
            }
        default:
            return state;
    }
}