import { CommonError } from '../../../modules/types';
import {
	SALE_LIST_ACTIVE,
	SALE_LIST_DATA,
	SALE_LIST_ENDED,
	SALE_LIST_ERROR,
	SALE_LIST_ONGOING,
	SALE_LIST_UPCOMING,
} from './constants';
import { SaleListState } from './types';

export interface ActiveSaleListFetch {
	type: typeof SALE_LIST_ACTIVE;
}

export interface UpcomingSaleListFetch {
	type: typeof SALE_LIST_UPCOMING;
}

export interface OngoingSaleListFetch {
	type: typeof SALE_LIST_ONGOING;
}

export interface EndedSaleListFetch {
	type: typeof SALE_LIST_ENDED;
}

export interface SaleListData {
	type: typeof SALE_LIST_DATA;
	payload: SaleListState;
}

export interface SaleListError {
	type: typeof SALE_LIST_ERROR;
	error: CommonError;
}

export type SaleListActions =
	| ActiveSaleListFetch
	| UpcomingSaleListFetch
	| OngoingSaleListFetch
	| EndedSaleListFetch
	| SaleListData
	| SaleListError;

export const activeSaleListFetch = (): ActiveSaleListFetch => ({
	type: SALE_LIST_ACTIVE,
});

export const upComingSaleListFetch = (): UpcomingSaleListFetch => ({
	type: SALE_LIST_UPCOMING,
});

export const onGoingSaleListFetch = (): OngoingSaleListFetch => ({
	type: SALE_LIST_ONGOING,
});

export const endedSaleListFetch = (): EndedSaleListFetch => ({
	type: SALE_LIST_ENDED,
});

export const saleListData = (payload: SaleListData['payload']): SaleListData => ({
	type: SALE_LIST_DATA,
	payload,
});

export const saleListError = (error: SaleListError['error']): SaleListError => ({
	type: SALE_LIST_ERROR,
	error,
});
