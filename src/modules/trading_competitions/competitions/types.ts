import { CommonState } from '../../../modules/types';
import { Competition } from '../competition_item';
export interface CompetionListState extends CommonState {
	payload: {
		ongoing: Competition[];
		upcoming: Competition[];
		ended: Competition[];
	};
	loading: boolean;
}
