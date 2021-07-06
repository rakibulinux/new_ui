import { BuyIEOActions } from './actions';
import {
	BUY_IEO_ERROR,
	BUY_IEO_RESPONSE,
	BUY_IEO_ITEM,
	GET_TOTAL_IEO_BUYERS,
	RESET_BUY_IEO_RESPONSE,
	TOTAL_IEO_BUYERS_DATA,
	TOTAL_IEO_BUYERS_ERROR,
} from './constants';
import { BuyIEOState, TotalIEOBuyersState } from './types';

export const initialBuyIEO: BuyIEOState = {
	payload: {
		ieo_id: '',
		uid: '',
		quantity: 0,
		total_purchase: 0,
		quote_currency: '',
	},
	loading: false,
};

export const buyIEOReducer = (state = initialBuyIEO, action: BuyIEOActions): BuyIEOState => {
	switch (action.type) {
		case BUY_IEO_ITEM:
			return {
				...state,
				loading: true,
				error: undefined,
			};
		case BUY_IEO_RESPONSE:
			const { payload } = action.payload;

			return {
				...state,
				payload: payload,
				loading: false,
				error: undefined,
			};
		case BUY_IEO_ERROR:
			return {
				...state,
				loading: false,
				error: action.error,
			};
		case RESET_BUY_IEO_RESPONSE:
			return {
				...state,
				loading: false,
			};
		default:
			return state;
	}
};

export const initialTotalBuyersIEO: TotalIEOBuyersState = {
	payload: {
		totalBuyers: 0,
	},
	loading: false,
};

export const totalIEOBuyersReducer = (state = initialTotalBuyersIEO, action: BuyIEOActions): TotalIEOBuyersState => {
	switch (action.type) {
		case GET_TOTAL_IEO_BUYERS:
			return {
				...state,
				loading: true,
				error: undefined,
			};
		case TOTAL_IEO_BUYERS_DATA:
			const { payload } = action.payload;

			return {
				...state,
				payload: payload,
				loading: false,
				error: undefined,
			};
		case TOTAL_IEO_BUYERS_ERROR:
			return {
				...state,
				loading: false,
				error: action.error,
			};
		default:
			return state;
	}
};
