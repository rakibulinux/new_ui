import produce from 'immer';
import { VoteDonateActions, VoteHistoryActions, VoteListActions } from './actions';
import {
	VOTE_DONATE_CREATE,
	VOTE_DONATE_DATA,
	VOTE_DONATE_ERROR,
	VOTE_HISTORY_DATA,
	VOTE_HISTORY_ERROR,
	VOTE_HISTORY_FETCH,
	VOTE_LIST_DATA,
	VOTE_LIST_ERROR,
	VOTE_LIST_FETCH,
} from './constants';
import { VoteDonateState, VoteHistoryState, VoteListState } from './types';

const initialVoteListState: VoteListState = {
	info: {
		data: [],
		total: 1,
	},
	infoRound: {
		lastWin: '',
		startDay: '',
		currentTime: '',
		roundEndDate: 10,
	},
	loading: false,
};

export const voteListReducer = (state = initialVoteListState, action: VoteListActions): VoteListState =>
	produce(state, draft => {
		let index: number;
		switch (action.type) {
			case VOTE_LIST_FETCH:
				draft.loading = true;
				break;
			case VOTE_LIST_DATA:
				draft.info.data = action.payload.data;
				draft.info.total = action.payload.total;
				if (draft.infoRound.startDay !== action.payload.infoRound.startDay) {
					draft.infoRound = action.payload.infoRound;
				}
				draft.loading = false;
				break;
			case VOTE_DONATE_DATA:
				index = draft.info.data.findIndex(item => item.id === action.payload.coin_id);
				if (index !== -1) {
					draft.info.data[index].total += +action.payload.amount;
					draft.info.data = draft.info.data.sort((a, b) => b.total - a.total);
				}
				break;
			case VOTE_LIST_ERROR:
				draft.loading = false;
				draft.error = action.error;
				break;
			default:
				break;
		}
	});

const initialVoteHistoryState: VoteHistoryState = {
	info: {
		data: [],
		total: 1,
	},
	loading: false,
};

export const voteHistoryReducer = (state = initialVoteHistoryState, action: VoteHistoryActions): VoteHistoryState =>
	produce(state, draft => {
		switch (action.type) {
			case VOTE_HISTORY_FETCH:
				draft.loading = true;
				break;
			case VOTE_HISTORY_DATA:
				draft.info = action.payload;
				draft.loading = false;
				break;
			case VOTE_DONATE_DATA:
				draft.info.data.unshift(action.payload);
				break;
			case VOTE_HISTORY_ERROR:
				draft.loading = false;
				draft.error = action.error;
				break;
			default:
				break;
		}
	});

const initialVoteDonateState: VoteDonateState = {
	loading: false,
};

export const voteDonateReducer = (state = initialVoteDonateState, action: VoteDonateActions): VoteDonateState =>
	produce(state, draft => {
		switch (action.type) {
			case VOTE_DONATE_CREATE:
				draft.loading = true;
				break;
			case VOTE_DONATE_DATA:
				draft.data = action.payload;
				draft.loading = false;
				break;
			case VOTE_DONATE_ERROR:
				draft.loading = false;
				draft.error = action.error;
				break;
			default:
				break;
		}
	});
