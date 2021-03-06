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
enum RankType {
	Friend = 'friend',
	Commision = 'commision',
}
export interface ReferralRank {
	rank: number;
	uid: string;
	total: string;
	type: RankType;
	top: number;
}

export interface ReferralRankState extends CommonState {
	payload: ReferralRank[];
	loading: boolean;
}

export interface EstimatedCommision {
	total: string;
}

export interface EstimatedCommisionState extends CommonState {
	payload: EstimatedCommision;
	loading: boolean;
}

export interface CommisionInfo {
	dekstop_image: string;
	mobile_image: string;
}

export interface CommisionInfoState extends CommonState {
	payload: CommisionInfo;
	loading: boolean;
}
