import { CommonError } from '../../types';
import {
	GET_LUNAR_AWARD,
	GET_LUNAR_LOTS,
	LUNAR_AWARD_DATA,
	LUNAR_AWARD_ERROR,
	LUNAR_ERROR,
	LUNAR_LOTS_DATA,
	LUNAR_LOTS_ERROR,
	LUNAR_REWARD_DATA,
	POST_LUNAR_REWARD,
} from './constants';
import { LunarsState, RewardsDataResponse } from './types';

export interface AwardFetch {
	type: typeof GET_LUNAR_AWARD;
}

export interface AwardError {
	type: typeof LUNAR_AWARD_ERROR;
	error: CommonError;
}

export interface AwardData {
	type: typeof LUNAR_AWARD_DATA;
	payload: LunarsState['awards']['data'];
}

export interface LotFetch {
	type: typeof GET_LUNAR_LOTS;
	uid: string;
}

export interface LotError {
	type: typeof LUNAR_LOTS_ERROR;
	error: CommonError;
}

export interface LotData {
	type: typeof LUNAR_LOTS_DATA;
	payload: LunarsState['lots']['data'];
}

export interface RewardPost {
	type: typeof POST_LUNAR_REWARD;
	payload: {
		uid: string;
		txid: string;
		cb: (payload: RewardsDataResponse) => void;
	};
}

export interface RewardData {
	type: typeof LUNAR_REWARD_DATA;
	payload: RewardsDataResponse;
}

export interface LunarError {
	type: typeof LUNAR_ERROR;
	error: CommonError;
}

export type LunarAction =
	| AwardFetch
	| AwardData
	| LotFetch
	| LotData
	| RewardPost
	| RewardData
	| LunarError
	| AwardError
	| LotError;

export const awardFetch = (): AwardFetch => ({
	type: GET_LUNAR_AWARD,
});

export const awardError = (error: AwardError['error']): AwardError => ({
	type: LUNAR_AWARD_ERROR,
	error,
});

export const awardData = (payload: AwardData['payload']): AwardData => ({
	type: LUNAR_AWARD_DATA,
	payload,
});

export const lotFetch = (uid: string): LotFetch => ({
	type: GET_LUNAR_LOTS,
	uid,
});

export const lotError = (error: LotError['error']): LotError => ({
	type: LUNAR_LOTS_ERROR,
	error,
});

export const lotData = (payload: LotData['payload']): LotData => ({
	type: LUNAR_LOTS_DATA,
	payload,
});

export const rewardPost = (payload: RewardPost['payload']): RewardPost => ({
	type: POST_LUNAR_REWARD,
	payload,
});

export const rewardData = (payload: RewardData['payload']): RewardData => ({
	type: LUNAR_REWARD_DATA,
	payload,
});

export const lunarError = (error: LunarError['error']): LunarError => ({
	type: LUNAR_ERROR,
	error,
});
