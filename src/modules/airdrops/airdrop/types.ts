import { CommonState } from '../../../modules/types';

export interface Airdrop {
    airdrop_id: number;
    airdrop_name: string;
    total_tokens: number;
    tokens_per_claim: number;
    remain_tokens: number;
    token_name: string;
    max_participants: number;
    start_date: string;
    end_date: string;
    deliver_date: string;
}

export interface AirdropState extends CommonState {
    payload: Airdrop[];
    total: number;
    loading: boolean;
}
