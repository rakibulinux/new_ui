// import { sliceArray } from '../../../../helpers';
import { ETHFeeWithdrawActions } from './actions';
import { ETH_FEE_WITHDRAW, ETH_FEE_WITHDRAW_ERROR } from './constants';
import { ETHFeeWithdrawState } from './types';

export const initialETHFeeWithdraw: ETHFeeWithdrawState = {
	payload: {
		uid: '',
		currency: '',
		amount: '0',
	},
	loading: false,
};

export const ethFeeWithdrawReducer = (state = initialETHFeeWithdraw, action: ETHFeeWithdrawActions): ETHFeeWithdrawState => {
	switch (action.type) {
		case ETH_FEE_WITHDRAW:
			const { payload } = action;

			return {
				...state,
				payload: payload,
				loading: false,
				error: undefined,
			};
		case ETH_FEE_WITHDRAW_ERROR:
			return {
				...state,
				loading: false,
				error: action.error,
			};
		default:
			return state;
	}
};
