import { RootState } from '../../index';
import { ETHFeeWithdrawState } from './types';

export const selectETHFeeWithdraw = (state: RootState): ETHFeeWithdrawState => state.ethFee.withdraw;
