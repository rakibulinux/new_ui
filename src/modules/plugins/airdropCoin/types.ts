import { CommonState } from '../../../modules/types';

export interface AirdropCoin {
	airdrop_id: number;
	airdrop_title: string;
	airdrop_link: string;
	distribution_at: string;
	created_at: string;
	updated_at: string;
}

export interface AirdropCoinClaim {
	airdrop_id: number;
	msg_status?: number;
	claim_doned: 0 | 1;
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
