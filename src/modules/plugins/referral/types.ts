import { CommonState } from '../../../modules/types';

export interface Friends {
	email: string;
	time: Date;
}

export interface FriendsListState extends CommonState {
	payload: [number, Friends[]];
	loading: boolean;
}

export interface CommisionHistory {
	email: string;
	total: string;
	time: Date;
	type: string;
}

export interface CommisionHistoryState extends CommonState {
	payload: [number, CommisionHistory[]];
	loading: boolean;
}

export interface ReferralRank {
	rank: number;
	email: string;
	total: string;
}

export interface ReferralRankState extends CommonState {
	payload: ReferralRank[];
	loading: boolean;
}
