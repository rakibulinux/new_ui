import { CommonError, CommonState } from '../../../modules/types';

export interface Award {
	id: number;
	award: number;
	quantity: number;
	remain: number;
}

export interface Lot {
	currency_id: string;
	amount: string;
	reward: number;
	txid: string;
	completed_at: string;
	used: boolean;
}

export interface Reward {
	lucky_id: number;
	award: number;
}

export interface RewardsDataResponse {
	success_award: Reward;
	fail_award: Reward[];
}

export interface LunarsState extends CommonState {
	awards: {
		data: Award[];
		loading: boolean;
	};
	lots: {
		data: Lot[];
		loading: boolean;
		firstCall: boolean;
	};
	loading: boolean;
	error?: CommonError;
}
