import { RootState } from '../../index';
import { PriceState } from './types';

export const selectPrice = (state: RootState): PriceState => state.sale.price;
