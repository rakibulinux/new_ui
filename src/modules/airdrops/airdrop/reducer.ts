// import { sliceArray } from '../../../../helpers';
import { AirdropActions } from './actions';
import {
    AIRDROP_DATA,
    AIRDROP_DELIVERED_FETCH,
    AIRDROP_DELIVERING_FETCH,
    AIRDROP_ERROR,
    AIRDROP_FETCH,
    AIRDROP_FETCH_ID,
    AIRDROP_OPENING_FETCH,
    AIRDROP_WAITING_FETCH
} from './constants';
import {
    AirdropState,
} from './types';

export const initialAirdrop: AirdropState = {
    payload: [],
    loading: false,
    total: 0
};

export const airdropReducer = (state = initialAirdrop, action: AirdropActions): AirdropState => {
    switch (action.type) {
        case AIRDROP_FETCH:
            return {
                ...state,
                loading: true,
                error: undefined,
            };
        case AIRDROP_WAITING_FETCH:
            return {
                ...state,
                loading: true,
                error: undefined,
            };
        case AIRDROP_OPENING_FETCH:
            return {
                ...state,
                loading: true,
                error: undefined,
            };
        case AIRDROP_DELIVERING_FETCH:
            return {
                ...state,
                loading: true,
                error: undefined,
            };
        case AIRDROP_DELIVERED_FETCH:
            return {
                ...state,
                loading: true,
                error: undefined,
            };
        case AIRDROP_FETCH:
            return {
                ...state,
                loading: true,
                error: undefined,
            };
        case AIRDROP_FETCH:
            return {
                ...state,
                loading: true,
                error: undefined,
            };
        case AIRDROP_FETCH_ID:
            return {
                ...state,
                loading: true,
                error: undefined,
            };
        case AIRDROP_DATA:
            const { payload, total } = action.payload;

            return {
                ...state,
                payload: payload,
                total: total,
                loading: false,
                error: undefined,
            };
        case AIRDROP_ERROR:
            return {
                ...state,
                loading: false,
                error: action.error,
            };
        default:
            return state;
    }
};
