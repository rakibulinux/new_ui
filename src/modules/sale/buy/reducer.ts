// import { sliceArray } from '../../../../helpers';
import { BuyActions } from './actions';
import {
	BUY_ERROR,
	BUY_RESPONSE,
	BUY_SALE_ITEM,
	GET_TOTAL_BUYERS,
	RESET_BUY_RESPONSE,
	TOTAL_BUYERS_DATA,
	TOTAL_BUYERS_ERROR,
} from './constants';
import { BuyState, TotalBuyersState } from './types';

export const initialBuy: BuyState = {
	payload: {
		ieo_id: '',
		uid: '',
		quantity: 0,
		total_purchase: 0,
		quote_currency: '',
	},
	loading: false,
};

export const buyReducer = (state = initialBuy, action: BuyActions): BuyState => {
	switch (action.type) {
		case BUY_SALE_ITEM:
			return {
				...state,
				loading: true,
				error: undefined,
			};
		case BUY_RESPONSE:
			const { payload } = action.payload;

			return {
				...state,
				payload: payload,
				loading: false,
				error: undefined,
			};
		case BUY_ERROR:
			return {
				...state,
				loading: false,
				error: action.error,
			};
		case RESET_BUY_RESPONSE:
			return {
				...state,
				loading: false,
			};
		default:
			return state;
	}
};

export const initialTotalBuyers: TotalBuyersState = {
	payload: {
		totalBuyers: 0,
	},
	loading: false,
};

export const totalBuyersReducer = (state = initialTotalBuyers, action: BuyActions): TotalBuyersState => {
	switch (action.type) {
		case GET_TOTAL_BUYERS:
			return {
				...state,
				loading: true,
				error: undefined,
			};
		case TOTAL_BUYERS_DATA:
			const { payload } = action.payload;

			return {
				...state,
				payload: payload,
				loading: false,
				error: undefined,
			};
		case TOTAL_BUYERS_ERROR:
			return {
				...state,
				loading: false,
				error: action.error,
			};
		default:
			return state;
	}
};
