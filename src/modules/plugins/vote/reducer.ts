import produce from 'immer';
import { VoteActions } from './actions';
import { VOTE_DONATE_CREATE, VOTE_DONATE_DATA, VOTE_LIST_DATA, VOTE_LIST_ERROR, VOTE_LIST_FETCH } from './constants';
import { VoteState } from './types';

const initialVoteState: VoteState = {
	info: {
		data: [],
		total: 1,
	},
	loading: false,
	donating: false,
};

export const voteReducer = (state = initialVoteState, action: VoteActions): VoteState =>
	produce(state, draft => {
		let index: number;
		switch (action.type) {
			case VOTE_LIST_FETCH:
				draft.loading = true;
				break;
			case VOTE_LIST_DATA:
				draft.info.data = action.payload.data;
				draft.info.total = action.payload.total;
				draft.loading = false;
				break;
			case VOTE_DONATE_CREATE:
				draft.donating = true;
				break;
			case VOTE_DONATE_DATA:
				index = draft.info.data.findIndex(item => item.id === action.payload.id);
				if (index !== -1) {
					draft.info.data[index].total += action.payload.amount;
				}
				draft.donating = false;
				break;
			case VOTE_LIST_ERROR:
				draft.donating = false;
				draft.loading = false;
				draft.error = action.error;
				break;
			default:
				break;
		}
	});
