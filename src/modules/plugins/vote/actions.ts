import { CommonError } from '../../../modules/types';
import { VOTE_DONATE_CREATE, VOTE_DONATE_DATA, VOTE_LIST_DATA, VOTE_LIST_ERROR, VOTE_LIST_FETCH } from './constants';
import { VoteCoin, VoteFilter } from './types';

export interface VoteListFetch {
	type: typeof VOTE_LIST_FETCH;
	payload: VoteFilter;
}
export interface VoteListData {
	type: typeof VOTE_LIST_DATA;
	payload: {
		data: VoteCoin[];
		total: number;
	};
}

export interface VoteDonateCreate {
	type: typeof VOTE_DONATE_CREATE;
	payload: {
		id: string;
		amount: number;
	};
}
export interface VoteDonateData {
	type: typeof VOTE_DONATE_DATA;
	payload: VoteDonateCreate['payload'];
}

export interface VoteListError {
	type: typeof VOTE_LIST_ERROR;
	error: CommonError;
}

export type VoteActions = VoteListFetch | VoteListData | VoteDonateCreate | VoteDonateData | VoteListError;

export const voteListFetch = (payload: VoteListFetch['payload']): VoteListFetch => ({
	type: VOTE_LIST_FETCH,
	payload: payload,
});

export const voteListData = (payload: VoteListData['payload']): VoteListData => ({
	type: VOTE_LIST_DATA,
	payload,
});

export const voteDonateCreate = (payload: VoteDonateCreate['payload']): VoteDonateCreate => ({
	type: VOTE_DONATE_CREATE,
	payload,
});

export const voteDonateData = (payload: VoteDonateData['payload']): VoteDonateData => ({
	type: VOTE_DONATE_DATA,
	payload,
});

export const voteListError = (error: VoteListError['error']): VoteListError => ({
	type: VOTE_LIST_ERROR,
	error,
});
