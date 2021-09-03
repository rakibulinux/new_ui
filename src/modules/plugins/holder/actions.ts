import { HOLDER_DATA, HOLDER_FETCH } from './constants';
import { Holder } from './types';

export interface FetchHolderList {
	type: typeof HOLDER_FETCH;
}

export interface HolderListData {
	type: typeof HOLDER_DATA;
	payload: Holder[];
}

export type CompetitionVolumeActions = FetchHolderList | HolderListData;

export const fetchHolderList = (): FetchHolderList => ({
	type: HOLDER_FETCH,
});

export const holderListData = (payload: HolderListData['payload']): HolderListData => ({
	type: HOLDER_DATA,
	payload,
});
