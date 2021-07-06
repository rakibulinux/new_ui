import { CommonError } from '../../../../modules/types';
import {
	BUY_ERROR,
	BUY_RESPONSE,
	BUY_IEO_ITEM,
	GET_TOTAL_BUYERS,
	RESET_BUY_RESPONSE,
	TOTAL_BUYERS_DATA,
	TOTAL_BUYERS_ERROR,
} from './constants';
import { Buy, BuyState, TotalBuyersState } from './types';

export interface BuyIEOItem {
	type: typeof BUY_IEO_ITEM;
	payload: Buy;
}

export interface BuyResponse {
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
	};
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
	| BuyIEOItem
	| BuyResponse
	| BuyError
	| ResetBuyResponse
	| GetTotalBuyers
	| TotalBuyersData
	| TotalBuyersError;

export const buyIEOItem = (payload: BuyIEOItem['payload']): BuyIEOItem => ({
	type: BUY_IEO_ITEM,
	payload,
});

export const buyResponse = (payload: BuyResponse['payload']): BuyResponse => ({
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
	payload,
});

export const totalBuyersData = (payload: TotalBuyersData['payload']): TotalBuyersData => ({
	type: TOTAL_BUYERS_DATA,
	payload,
});

export const totalBuyersError = (error: TotalBuyersError['error']): TotalBuyersError => ({
	type: TOTAL_BUYERS_ERROR,
	error,
});
