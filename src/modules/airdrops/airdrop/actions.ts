import { CommonError } from '../../../modules/types';
import {
	AIRDROP_DATA,
	AIRDROP_DELIVERED_FETCH,
	AIRDROP_DELIVERING_FETCH,
	AIRDROP_ERROR,
	AIRDROP_FETCH,
	AIRDROP_FETCH_ID,
	AIRDROP_OPENING_FETCH,
	AIRDROP_WAITING_FETCH,
} from './constants';
import { AirdropState } from './types';

export interface AirdropFetch {
	type: typeof AIRDROP_FETCH;
}

export interface WaitingAirdropFetch {
	type: typeof AIRDROP_WAITING_FETCH;
	payload: {
		page: number;
		size: number;
	};
}

export interface OpeningAirdropFetch {
	type: typeof AIRDROP_OPENING_FETCH;
	payload: {
		page: number;
		size: number;
	};
}

export interface DeliveringAirdropFetch {
	type: typeof AIRDROP_DELIVERING_FETCH;
	payload: {
		page: number;
		size: number;
	};
}

export interface DeliveredAirdropFetch {
	type: typeof AIRDROP_DELIVERED_FETCH;
	payload: {
		page: number;
		size: number;
	};
}

export interface AirdropFetchId {
	type: typeof AIRDROP_FETCH_ID;
	payload: {
		id: string;
	};
}

export interface AirdropData {
	type: typeof AIRDROP_DATA;
	payload: AirdropState;
}

export interface AirdropError {
	type: typeof AIRDROP_ERROR;
	error: CommonError;
}

export type AirdropActions =
	| AirdropFetch
	| WaitingAirdropFetch
	| OpeningAirdropFetch
	| DeliveringAirdropFetch
	| DeliveredAirdropFetch
	| AirdropFetchId
	| AirdropData
	| AirdropError;

export const airdropFetch = (): AirdropFetch => ({
	type: AIRDROP_FETCH,
});

export const waitingAirdropFetch = (payload: WaitingAirdropFetch['payload']): WaitingAirdropFetch => ({
	type: AIRDROP_WAITING_FETCH,
	payload,
});

export const openingAirdropFetch = (payload: OpeningAirdropFetch['payload']): OpeningAirdropFetch => ({
	type: AIRDROP_OPENING_FETCH,
	payload,
});

export const deliveringAirdropFetch = (payload: DeliveringAirdropFetch['payload']): DeliveringAirdropFetch => ({
	type: AIRDROP_DELIVERING_FETCH,
	payload,
});

export const deliveredAirdropFetch = (payload: DeliveredAirdropFetch['payload']): DeliveredAirdropFetch => ({
	type: AIRDROP_DELIVERED_FETCH,
	payload,
});

export const airdropFetchId = (payload: AirdropFetchId['payload']): AirdropFetchId => ({
	type: AIRDROP_FETCH_ID,
	payload,
});

export const airdropData = (payload: AirdropData['payload']): AirdropData => ({
	type: AIRDROP_DATA,
	payload,
});

export const airdropError = (error: AirdropError['error']): AirdropError => ({
	type: AIRDROP_ERROR,
	error,
});
