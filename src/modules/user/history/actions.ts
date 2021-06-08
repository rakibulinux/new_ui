import {
	HISTORY_ALL_DATA,
	HISTORY_ALL_FETCH,
	HISTORY_DATA,
	HISTORY_ERROR,
	HISTORY_FETCH,
	HISTORY_PUSH_EMIT,
	HISTORY_PUSH_FINISH,
	HISTORY_RESET,
} from './constants';
import { PrivateTradeEvent, WalletHistoryList } from './types';

export interface HistoryFetchPayload {
	currency?: string;
	page: number;
	type: string;
	limit?: number;
	market?: string;
	time_from?: string;
	time_to?: string;
}

interface HistorySuccessPayload {
	list: WalletHistoryList;
	page: number;
	nextPageExists: boolean;
}
interface HistorySuccessAllPayload {
	list: WalletHistoryList;
}

export interface HistoryFetch {
	type: typeof HISTORY_FETCH;
	payload: HistoryFetchPayload;
}

export interface HistoryData {
	type: typeof HISTORY_DATA;
	payload: HistorySuccessPayload;
}

export interface HistoryAllFetch {
	type: typeof HISTORY_ALL_FETCH;
	payload: HistoryFetchPayload;
}

export interface HistoryAllData {
	type: typeof HISTORY_ALL_DATA;
	payload: HistorySuccessAllPayload;
}

export interface HistoryError {
	type: typeof HISTORY_ERROR;
	payload: WalletHistoryList;
}

export interface HistoryPushFinish {
	type: typeof HISTORY_PUSH_FINISH;
	payload: WalletHistoryList;
}

export interface HistoryReset {
	type: typeof HISTORY_RESET;
}

export interface HistoryPush {
	type: typeof HISTORY_PUSH_EMIT;
	payload: PrivateTradeEvent;
}

export type HistoryActions =
	| HistoryFetch
	| HistoryData
	| HistoryError
	| HistoryReset
	| HistoryPush
	| HistoryAllFetch
	| HistoryAllData
	| HistoryPushFinish;

export const fetchHistory = (payload: HistoryFetchPayload): HistoryFetch => ({
	type: HISTORY_FETCH,
	payload,
});

export const successHistory = (payload: HistorySuccessPayload): HistoryData => ({
	type: HISTORY_DATA,
	payload,
});

export const historyAllFetch = (payload: HistoryFetchPayload): HistoryAllFetch => ({
	type: HISTORY_ALL_FETCH,
	payload,
});

export const historyAllData = (payload: HistorySuccessAllPayload): HistoryAllData => ({
	type: HISTORY_ALL_DATA,
	payload,
});

export const failHistory = (payload: WalletHistoryList): HistoryError => ({
	type: HISTORY_ERROR,
	payload,
});

export const resetHistory = (): HistoryReset => ({
	type: HISTORY_RESET,
});

export const pushHistoryEmit = (payload: PrivateTradeEvent): HistoryPush => ({
	type: HISTORY_PUSH_EMIT,
	payload,
});

export const pushHistoryFinish = (payload: WalletHistoryList): HistoryPushFinish => ({
	type: HISTORY_PUSH_FINISH,
	payload,
});
