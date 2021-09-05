import { CommonError } from '../../../modules/types';
import { SALE_FIND_BY_ID, SALE_ITEM_DATA, SALE_ITEM_ERROR } from './constants';
import { SaleItemState } from './types';

export interface FindSaleById {
	type: typeof SALE_FIND_BY_ID;
	payload: {
		id: number | string;
	};
}

export interface SaleItemData {
	type: typeof SALE_ITEM_DATA;
	payload: SaleItemState;
}

export interface SaleItemError {
	type: typeof SALE_ITEM_ERROR;
	error: CommonError;
}

export type SaleItemActions = FindSaleById | SaleItemData | SaleItemError;

export const findSalebyId = (payload: FindSaleById['payload']): FindSaleById => ({
	type: SALE_FIND_BY_ID,
	payload,
});

export const saleItemData = (payload: SaleItemData['payload']): SaleItemData => ({
	type: SALE_ITEM_DATA,
	payload,
});

export const saleItemError = (error: SaleItemError['error']): SaleItemError => ({
	type: SALE_ITEM_ERROR,
	error,
});
