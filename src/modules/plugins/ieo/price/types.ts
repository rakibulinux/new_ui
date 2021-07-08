import { CommonState } from '../../../modules/types';

export interface PriceState extends CommonState {
	payload: any;
	loading: boolean;
}
