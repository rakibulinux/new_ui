import { RootState } from '../../index';
import { SaleListState } from './types';

export const selectSaleList = (state: RootState): SaleListState => state.sale.saleList;
