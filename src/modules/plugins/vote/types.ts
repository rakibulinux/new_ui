import { CommonState } from '../../../modules/types';

export interface VoteCoin {
	id: string;
	name: string;
	website: string;
	active: boolean;
	created_at: string;
	total: number;
}

export interface VoteHistory {
	id: number;
	coin_id: string;
	amount: string;
	name: string;
	created_at: string;
	updated_at: string;
}

export interface VoteFilter {
	pageIndex?: number;
	limit?: number;
	keyword?: string;
}
export interface VoteListState extends CommonState {
	info: {
		data: VoteCoin[];
		total: number;
	};
}

export interface VoteHistoryState extends CommonState {
	info: {
		data: VoteHistory[];
		total: number;
	};
}
export interface VoteDonateState extends CommonState {
	data?: VoteHistory;
}
