import { SaleItem } from '../..';
import { CommonState } from '../../../modules/types';

export interface SaleListState extends CommonState {
	payload: SaleItem[];
	loading: boolean;
}
