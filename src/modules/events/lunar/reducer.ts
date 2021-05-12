import produce from 'immer';
import { LunarAction } from './actions';
import {
	GET_LUNAR_AWARD,
	GET_LUNAR_LOTS,
	LUNAR_AWARD_DATA,
	LUNAR_AWARD_ERROR,
	LUNAR_ERROR,
	LUNAR_LOTS_DATA,
	LUNAR_LOTS_ERROR,
	LUNAR_REWARD_DATA,
	POST_LUNAR_REWARD,
} from './constants';
import { LunarsState } from './types';

export const initialLunar: LunarsState = {
	awards: {
		data: [],
		loading: false,
	},
	lots: {
		data: [],
		loading: false,
		firstCall: false,
	},
	loading: false,
};

export const lunarReducer = (state = initialLunar, action: LunarAction): LunarsState => {
	return produce(state, draft => {
		switch (action.type) {
			case GET_LUNAR_AWARD:
				draft.awards.loading = true;
				break;
			case LUNAR_AWARD_DATA:
				draft.awards.loading = false;
				draft.awards.data = action.payload;
				break;
			case GET_LUNAR_LOTS:
				draft.lots.loading = true;
				draft.lots.firstCall = true;
				break;
			case LUNAR_LOTS_DATA:
				draft.lots.loading = false;
				draft.lots.data = action.payload;
				break;
			case POST_LUNAR_REWARD:
				draft.loading = true;
				break;
			case LUNAR_REWARD_DATA:
				draft.loading = false;
				draft.lots.firstCall = false;
				break;
			case LUNAR_AWARD_ERROR:
				draft.awards.loading = false;
				draft.error = action.error;
				break;
			case LUNAR_LOTS_ERROR:
				draft.lots.loading = false;
				draft.error = action.error;
				break;
			case LUNAR_ERROR:
				draft.loading = false;
				draft.error = action.error;
				break;
			default:
				break;
		}
	});
};
