import { CommonError } from '../../../modules/types';
import { TRADING_RANKINGS_DATA, TRADING_RANKINGS_ERROR, TRADING_RANKINGS_FETCH } from './constants';
import { TradingRankingsState } from './types';

export interface TradingRankingsFetch {
	type: typeof TRADING_RANKINGS_FETCH;
	payload: {
		competition_id: number | string;
	};
}

export interface TradingRankingsData {
	type: typeof TRADING_RANKINGS_DATA;
	payload: TradingRankingsState;
}

export interface TradingRankingsError {
	type: typeof TRADING_RANKINGS_ERROR;
	error: CommonError;
}

export type TradingRankingsActions = TradingRankingsFetch | TradingRankingsData | TradingRankingsError;

export const tradingRankingsFetch = (payload: TradingRankingsFetch['payload']): TradingRankingsFetch => ({
	type: TRADING_RANKINGS_FETCH,
	payload,
});

export const tradingRankingsData = (payload: TradingRankingsData['payload']): TradingRankingsData => ({
	type: TRADING_RANKINGS_DATA,
	payload,
});

export const tradingRankingsError = (error: TradingRankingsError['error']): TradingRankingsError => ({
	type: TRADING_RANKINGS_ERROR,
	error,
});
