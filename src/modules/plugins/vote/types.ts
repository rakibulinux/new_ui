import { CommonState } from '../../../modules/types';

export interface VoteCoin {
	id: string;
	name: string;
	website: string;
	active: boolean;
	uid: string;
	created_at: string;
	total: number;
}

export interface VoteFilter {
	pageIndex?: number;
	limit?: number;
	keyword?: string;
}

export interface VoteState extends CommonState {
	info: {
		data: VoteCoin[];
		total: number;
	};
	donating: boolean;
}
