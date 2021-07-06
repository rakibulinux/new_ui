import { RootState } from '../../../index';
import { BuyState, TotalBuyersState } from './types';

export const selectBuy = (state: RootState): BuyState => state.IEO.buy;
export const selectTotalBuyers = (state: RootState): TotalBuyersState => state.IEO.totalBuyers;
