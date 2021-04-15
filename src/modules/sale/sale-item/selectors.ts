import { RootState } from '../../index';
import { SaleItemState } from './types';

export const selectSaleItem = (state: RootState): SaleItemState => state.sale.saleItem;
