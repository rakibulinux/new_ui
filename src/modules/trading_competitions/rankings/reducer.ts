// import { sliceArray } from '../../../../helpers';
import { TradingRankingsActions } from './actions';
import { TRADING_RANKINGS_DATA, TRADING_RANKINGS_ERROR, TRADING_RANKINGS_FETCH } from './constants';
import { TradingRankingsState } from './types';

export const initialTradingRankings: TradingRankingsState = {
	payload: [],
	loading: false,
};

export const rankingsReducer = (state = initialTradingRankings, action: TradingRankingsActions): TradingRankingsState => {
	switch (action.type) {
		case TRADING_RANKINGS_FETCH:
			return {
				...state,
				loading: true,
				error: undefined,
			};
		case TRADING_RANKINGS_DATA:
			const { payload } = action.payload;

			return {
				...state,
				payload: payload,
				loading: false,
				error: undefined,
			};
		case TRADING_RANKINGS_ERROR:
			return {
				...state,
				loading: false,
				error: action.error,
			};
		default:
			return state;
	}
};
