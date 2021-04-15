// import { sliceArray } from '../../../../helpers';
import { SaleItemActions } from './actions';
import {
    SALE_ITEM_DATA,
    SALE_ITEM_ERROR,
    SALE_FIND_BY_ID
} from './constants';
import {
    SaleItemState,
} from './types';

export const initialSaleItem: SaleItemState = {
    payload: {
        id: "",
        currency_id: "",
        image_link: "",
        currency_available: [],
        total_ieo: 0,
        remains: 0,
        price: 0,
        min_buy: 0,
        start_date: "",
        end_date: "",
        bonus: "",
        social: {},
        type: 'upcoming'
    },
    loading: false,
};

export const saleItemReducer = (state = initialSaleItem, action: SaleItemActions): SaleItemState => {
    switch (action.type) {
        case SALE_FIND_BY_ID:
            return {
                ...state,
                loading: true,
                error: undefined,
            };
        case SALE_ITEM_DATA:
            const { payload } = action.payload;

            return {
                ...state,
                payload: payload,
                loading: false,
                error: undefined,
            };
        case SALE_ITEM_ERROR:
            return {
                ...state,
                loading: false,
                error: action.error,
            };
        default:
            return state;
    }
};
