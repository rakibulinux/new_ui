import { RootState } from '../../index';
import { TradingRankingsState } from './types';

export const selectTradingRankings = (state: RootState): TradingRankingsState => state.trading_competitions.rankings;
