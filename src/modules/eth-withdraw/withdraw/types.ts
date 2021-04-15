import { CommonState } from '../../types';

export interface ETHFeeWithdraws {
    uid: string;
    currency: string;
    amount: string;
}

export interface ETHFeeWithdrawState extends CommonState {
    payload: ETHFeeWithdraws;
    loading: boolean;
}
