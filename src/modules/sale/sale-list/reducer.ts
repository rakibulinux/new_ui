// import { sliceArray } from '../../../../helpers';
import { SaleListActions } from './actions';
import {
    SALE_LIST_DATA,
    SALE_LIST_ERROR,
    SALE_LIST_ACTIVE,
    SALE_LIST_UPCOMING,
    SALE_LIST_ONGOING,
    SALE_LIST_ENDED,
} from './constants';
import {
    SaleListState,
} from './types';

export const initialSaleList: SaleListState = {
    payload: [],
    loading: false,
};

export const saleListReducer = (state = initialSaleList, action: SaleListActions): SaleListState => {
    switch (action.type) {
        case SALE_LIST_ACTIVE:
            return {
                ...state,
                loading: true,
                error: undefined,
            };
        case SALE_LIST_UPCOMING:
            return {
                ...state,
                loading: true,
                error: undefined,
            };
        case SALE_LIST_ONGOING:
            return {
                ...state,
                loading: true,
                error: undefined,
            };
        case SALE_LIST_ENDED:
            return {
                ...state,
                loading: true,
                error: undefined,
            };
        case SALE_LIST_DATA:
            const { payload } = action.payload;

            return {
                ...state,
                payload: payload,
                loading: false,
                error: undefined,
            };
        case SALE_LIST_ERROR:
            return {
                ...state,
                loading: false,
                error: action.error,
            };
        default:
            return state;
    }
};
