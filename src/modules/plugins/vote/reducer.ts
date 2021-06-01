import produce from 'immer';
import { VoteActions } from './actions';
import { VOTE_LIST_DATA, VOTE_LIST_ERROR, VOTE_LIST_FETCH } from './constants';
import { VoteState } from './types';

const initialVoteState: VoteState = {
	info: {
		data: [],
		total: 1,
	},
	loading: false,
};

export const voteReducer = (state = initialVoteState, action: VoteActions): VoteState =>
	produce(state, draft => {
		switch (action.type) {
			case VOTE_LIST_FETCH:
				draft.loading = true;
				break;
			case VOTE_LIST_DATA:
				draft.info.data = action.payload.data;
				draft.info.total = action.payload.total;
				draft.loading = false;
				break;
			case VOTE_LIST_ERROR:
				draft.loading = false;
				draft.error = action.error;
				break;
			default:
				break;
		}
	});
