import { HolderInfoState, HolderListState, HOLDER_INFO_DATA, HOLDER_INFO_GET } from '.';
import { HOLDER_DATA, HOLDER_FETCH } from './constants';

export interface FetchHolderList {
	type: typeof HOLDER_FETCH;
	payload: {
		page: number;
		limit: number;
	};
}

export interface HolderListData {
	type: typeof HOLDER_DATA;
	payload: HolderListState;
}

export interface GetHolderInfo {
	type: typeof HOLDER_INFO_GET;
}

export interface HolderInfoData {
	type: typeof HOLDER_INFO_DATA;
	payload: HolderInfoState;
}

export type HolderListActions = FetchHolderList | HolderListData;
export type HolderInfoActions = GetHolderInfo | HolderInfoData;

export const fetchHolderList = (payload: FetchHolderList['payload']): FetchHolderList => ({
	type: HOLDER_FETCH,
	payload,
});

export const holderListData = (payload: HolderListData['payload']): HolderListData => ({
	type: HOLDER_DATA,
	payload,
});

export const getHolderInfo = (): GetHolderInfo => ({
	type: HOLDER_INFO_GET,
});

export const holderInfoData = (payload: HolderInfoData['payload']): HolderInfoData => ({
	type: HOLDER_INFO_DATA,
	payload,
});
