import { RootState } from '../../../index';
import { BuyIEOState, TotalIEOBuyersState } from './types';

export const selectBuyIEO = (state: RootState): BuyIEOState => state.IEO.buyIEO;
export const selectTotalIEOBuyers = (state: RootState): TotalIEOBuyersState => state.IEO.totalIEOBuyers;
