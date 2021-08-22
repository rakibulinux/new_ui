import { COMPETITION_ITEM_DATA, COMPETITION_ITEM_ERROR, COMPETITION_ITEM_FETCH } from './constants';
import { NewCompetitionState } from './types';
import { CompetitionItemActions } from './';
const initialCompetitionItemState: {
	payload: NewCompetitionState;
	loading: boolean;
} = {
	payload: {
		id: 0,
		status: 'ended',
		currency_id: '',
		type: 'trade',
		currency_image: '',
		total_prize: '',
		market_ids: '',
		next_update: '',
		start_date: '',
		end_date: '',
		limit_display: 0,
	},
	loading: true,
};

export const CompetitionItemReducer = (state = initialCompetitionItemState, action: CompetitionItemActions) => {
	switch (action.type) {
		case COMPETITION_ITEM_FETCH:
			return {
				...state,
				loading: true,
				error: undefined,
			};
		case COMPETITION_ITEM_DATA:
			const data = action.payload as NewCompetitionState;
			return {
				...state,
				payload: data,
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
