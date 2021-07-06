import { RootState } from '../../../index';
import { BuyState, TotalBuyersState } from './types';

export const selectBuy = (state: RootState): BuyState => state.sale.buy;
export const selectTotalBuyers = (state: RootState): TotalBuyersState => state.sale.totalBuyers;
