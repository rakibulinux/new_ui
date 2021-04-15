import { CommonError } from '../../types';
import {
    ETH_FEE_WITHDRAW_ERROR,
    ETH_FEE_WITHDRAW
} from './constants';
import {
    ETHFeeWithdraws
} from './types';

export interface ETHFeeWithdraw {
    type: typeof ETH_FEE_WITHDRAW;
    payload: ETHFeeWithdraws;
}


export interface ETHFeeWithdrawError {
    type: typeof ETH_FEE_WITHDRAW_ERROR;
    error: CommonError;
}

export type ETHFeeWithdrawActions =
    ETHFeeWithdraw
    | ETHFeeWithdrawError;


export const ethFeeWithdraw = (payload: ETHFeeWithdraw['payload']): ETHFeeWithdraw => ({
    type: ETH_FEE_WITHDRAW,
    payload,
});

export const ethFeeWithdrawError = (error: ETHFeeWithdrawError['error']): ETHFeeWithdrawError => ({
    type: ETH_FEE_WITHDRAW_ERROR,
    error,
});
