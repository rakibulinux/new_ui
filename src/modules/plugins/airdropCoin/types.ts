import { CommonState } from '../../../modules/types';

export interface AirdropCoin {
	airdrop_id: string;
	airdrop_title: string;
	active: 0 | 1;
	max_claim: number;
	total_claim: number;
	started_at: string;
	ended_at: string;
	distribution_at: string;
	created_at: string;
	updated_at: string;
	bot?: {
		airdrop_id: string;
		config_bot?: {
			tele_username_bot: string;
			value_of_gift: string;
			value_of_gift_ref: string;
		};
	};
}

export interface AirdropCoinClaim {
	airdrop_id: string;
	msg_status?: number;
	claim_doned: null | 0 | 1;
	claim_ip?: string;
	created_at: string;
	msg_status_msg_claim?: { msg_note: string };
}

export interface AirdropCoinClaimState extends CommonState {
	data: AirdropCoinClaim[];
}

export interface AirdropCoinState extends CommonState {
	data: AirdropCoin[];
}
