import { CommonError } from '../../../modules/types';
import { VOTE_LIST_DATA, VOTE_LIST_ERROR, VOTE_LIST_FETCH } from './constants';
import { VoteCoin, VotePagination } from './types';

export interface VoteListFetch {
	type: typeof VOTE_LIST_FETCH;
	payload: VotePagination;
}
export interface VoteListData {
	type: typeof VOTE_LIST_DATA;
	payload: {
		data: VoteCoin[];
		total: number;
	};
}

export interface VoteListError {
	type: typeof VOTE_LIST_ERROR;
	error: CommonError;
}

export type VoteActions = VoteListFetch | VoteListData | VoteListError;

export const voteListFetch = (payload: VoteListFetch['payload']): VoteListFetch => ({
	type: VOTE_LIST_FETCH,
	payload: payload,
});

export const voteListData = (payload: VoteListData['payload']): VoteListData => ({
	type: VOTE_LIST_DATA,
	payload,
});

export const voteListError = (error: VoteListError['error']): VoteListError => ({
	type: VOTE_LIST_ERROR,
	error,
});
