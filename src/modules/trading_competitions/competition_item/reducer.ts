// import { sliceArray } from '../../../../helpers';
import { CompetitionItemActions } from './actions';
import { COMPETITION_FIND_BY_ID, COMPETITION_ITEM_DATA, COMPETITION_ITEM_ERROR } from './constants';
import { CompetitionItemState } from './types';

export const initialCompetitionItem: CompetitionItemState = {
	payload: {
		id: 0,
		currency_id: '',
		currency_image: '',
		total_prize: '',
		market_ids: [],
		next_update: '',
		start_date: '',
		end_date: '',
	},
	loading: true,
};

export const competitionItemReducer = (state = initialCompetitionItem, action: CompetitionItemActions): CompetitionItemState => {
	switch (action.type) {
		case COMPETITION_FIND_BY_ID:
			return {
				...state,
				loading: true,
				error: undefined,
			};
		case COMPETITION_ITEM_DATA:
			const { payload } = action.payload;
			return {
				...state,
				payload: payload,
				loading: false,
				error: undefined,
			};
		case COMPETITION_ITEM_ERROR:
			return {
				...state,
				loading: false,
				error: action.error,
			};
		default:
			return state;
	}
};
