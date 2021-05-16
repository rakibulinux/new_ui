import { CommonState } from '../../../modules/types';

export interface StakingReward {
	reward_id: string;
	staking_id: string;
	period: string;
	total_amount: string;
	cap_amount: string;
	min_amount: string;
	cap_amount_per_user: string;
	annual_rate: string;
	payment_time: string;
}

export interface Stake {
	staking_id: string;
	currency_id: string;
	staking_name: string;
	description: string;
	start_time: string;
	end_time: string;
	active: boolean;
	rewards: StakingReward[];
	icon_url: string;
	status: 'upcoming' | 'running' | 'ended' | '';
}

export interface StakeWallet {
	balance?: string;
	currency: string;
	name: string;
	type: 'fiat' | 'coin';
	fee: number;
	address?: string;
	locked?: string;
	explorerTransaction: string;
	explorerAddress: string;
	fixed: number;
	iconUrl?: string;
}

export interface StakeHistory {
	currency_id: string;
	staking_name: string;
	period: string;
	amount: string;
	distributed_amount: string;
	lockup_date: string;
	release_date: string;
	status: string;
}

export interface StakeHistoryState extends CommonState {
	payload: StakeHistory[];
	loading: boolean;
}

export interface StakeWalletState extends CommonState {
	payload: StakeWallet[];
	loading: boolean;
}

export interface StakingListState extends CommonState {
	payload: Stake[];
	loading: boolean;
}

export interface CreateStakeState extends CommonState {
	loading: boolean;
}
