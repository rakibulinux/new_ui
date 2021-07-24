import { RootState } from '../../../index';
import { BuyIEOLoadingState, TotalIEOBuyersState } from './types';

export const selectBuyIEO = (state: RootState): BuyIEOLoadingState => state.IEO.buyIEO;
export const selectTotalIEOBuyers = (state: RootState): TotalIEOBuyersState => state.IEO.totalIEOBuyers;
