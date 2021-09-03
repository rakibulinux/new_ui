import { HolderListState } from '.';
import { CompetitionVolumeActions } from './actions';
import { HOLDER_DATA, HOLDER_FETCH } from './constants';

const initialHolderListState: HolderListState = {
	payload: [],
	loading: true,
};

export const holderListReducer = (state = initialHolderListState, action: CompetitionVolumeActions) => {
	switch (action.type) {
		case HOLDER_FETCH:
			return {
				...state,
				loading: true,
				error: undefined,
			};
		case HOLDER_DATA:
			const data = action.payload;

			return {
				...state,
				payload: data,
				loading: false,
				error: undefined,
			};

		default:
			return state;
	}
};
