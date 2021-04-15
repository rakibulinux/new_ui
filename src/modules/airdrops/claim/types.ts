import { CommonState } from '../../../modules/types';

export interface Claim {
    claim_id: number;
    airdrop_id: number;
    user_uid: string;
    email: string;
    bonus: string;
    timer_claim: string;
    facebook_id?: string;
    twitter_username?: string;
    telegram_username?: string;
    user_ip?: string;
    claim_status: number;
}

export interface ClaimState extends CommonState {
    payload: Claim[];
    loading: boolean;
}
