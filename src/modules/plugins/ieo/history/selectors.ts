import { RootState } from '../../../index';
import { BuyHistoryListState, BuyersHistoryState } from './types';

export const selectBuyHistoryList = (state: RootState): BuyHistoryListState => state.IEO.buyHistory;
export const selectBuyersHistory = (state: RootState): BuyersHistoryState => state.IEO.buyersHistory;
