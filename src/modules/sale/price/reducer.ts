// import { sliceArray } from '../../../../helpers';
import { PriceActions } from './actions';
import {
    PRICE_DATA,
    PRICE_ERROR,
    GET_PRICE
} from './constants';
import {
    PriceState,
} from './types';

export const initialPrice: PriceState = {
    payload: {},
    loading: false,
};

export const priceReducer = (state = initialPrice, action: PriceActions): PriceState => {
    switch (action.type) {
        case GET_PRICE:
            return {
                ...state,
                loading: true,
                error: undefined,
            };
        case PRICE_DATA:
            const { payload } = action.payload;

            return {
                ...state,
                payload: payload,
                loading: false,
                error: undefined,
            };
        case PRICE_ERROR:
            return {
                ...state,
                loading: false,
                error: action.error,
            };
        default:
            return state;
    }
};
