import { CommonError } from '../../../modules/types';
import {
    BUY_RESPONSE,
    BUY_ERROR,
    BUY_SALE_ITEM,
    RESET_BUY_RESPONSE,
    GET_TOTAL_BUYERS,
    TOTAL_BUYERS_DATA,
    TOTAL_BUYERS_ERROR
} from './constants';
import {
    BuyState, TotalBuyersState,Buy
} from './types';

export interface BuySaleItem {
    type: typeof BUY_SALE_ITEM;
    payload: Buy
}

export interface BuyRespone {
    type: typeof BUY_RESPONSE;
    payload: BuyState;
}

export interface BuyError {
    type: typeof BUY_ERROR;
    error: CommonError;
}

export interface GetTotalBuyers {
    type: typeof GET_TOTAL_BUYERS;
    payload: {
        ieo_id: string;
    }
}

export interface TotalBuyersData {
    type: typeof TOTAL_BUYERS_DATA;
    payload: TotalBuyersState;
}

export interface TotalBuyersError {
    type: typeof TOTAL_BUYERS_ERROR;
    error: CommonError;
}

export interface ResetBuyResponse {
    type: typeof RESET_BUY_RESPONSE;
}

export type BuyActions =
BuySaleItem
    | BuyRespone
    | BuyError
    | ResetBuyResponse
    | GetTotalBuyers
    | TotalBuyersData
    | TotalBuyersError;

export const buySaleItem = (payload: BuySaleItem['payload']): BuySaleItem => ({
    type: BUY_SALE_ITEM,
    payload
});

export const buyResponse = (payload: BuyRespone['payload']): BuyRespone => ({
    type: BUY_RESPONSE,
    payload,
});

export const buyError = (error: BuyError['error']): BuyError => ({
    type: BUY_ERROR,
    error,
});

export const resetBuyResponse = (): ResetBuyResponse => ({
    type: RESET_BUY_RESPONSE,
});


export const getTotalBuyers = (payload: GetTotalBuyers['payload']): GetTotalBuyers => ({
    type: GET_TOTAL_BUYERS,
    payload
});

export const totalBuyersData = (payload: TotalBuyersData['payload']): TotalBuyersData => ({
    type: TOTAL_BUYERS_DATA,
    payload,
});

export const totalBuyersError = (error: TotalBuyersError['error']): TotalBuyersError => ({
    type: TOTAL_BUYERS_ERROR,
    error,
});
