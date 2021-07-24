import { IEOItem } from './../';
import { CommonState } from '../../../../modules/types';

export interface IEOListState extends CommonState {
	payload: Array<IEOItem>;
	loading: boolean;
}
