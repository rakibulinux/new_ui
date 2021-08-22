import { CommonState } from 'modules/types';
import { NewCompetitionState } from '../item/types';

export interface ListCompetitionState extends CommonState {
	payload: NewCompetitionState[];
	loading: boolean;
}
