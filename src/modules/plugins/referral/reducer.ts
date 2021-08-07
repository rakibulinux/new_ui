import { FriendsActions, CommisionHistoryActions, ReferralRanksActions } from './actions';
import {
	FRIENDS_LIST_FETCH,
	FRIENDS_LIST_DATA,
	COMMISION_HISTORY_FETCH,
	COMMISION_HISTORY_DATA,
	REFERRAL_RANKS_FETCH,
	REFERRAL_RANKS_DATA,
} from './constants';
import { FriendsListState, CommisionHistoryState, ReferralRankState } from './types';

const initialFriendsListState: FriendsListState = {
	payload: [0, []],
	loading: false,
};

export const friendsListReducer = (state = initialFriendsListState, action: FriendsActions): FriendsListState => {
	switch (action.type) {
		case FRIENDS_LIST_FETCH:
			return {
				...state,
				loading: true,
				error: undefined,
			};
		case FRIENDS_LIST_DATA:
			const { payload, loading } = action.payload;
			return {
				...state,
				payload: payload,
				loading: loading,
				error: undefined,
			};
		default:
			return state;
	}
};

const initialCommisionHistoryState: CommisionHistoryState = {
	payload: [0, []],
	loading: false,
};

export const commsionHistoryReducer = (
	state = initialCommisionHistoryState,
	action: CommisionHistoryActions,
): CommisionHistoryState => {
	switch (action.type) {
		case COMMISION_HISTORY_FETCH:
			return {
				...state,
				loading: true,
				error: undefined,
			};
		case COMMISION_HISTORY_DATA:
			const { payload, loading } = action.payload;
			return {
				...state,
				payload: payload,
				loading: loading,
				error: undefined,
			};
		default:
			return state;
	}
};

const initialReferralRanksState: ReferralRankState = {
	payload: [],
	loading: false,
};

export const referralRanksReducer = (state = initialReferralRanksState, action: ReferralRanksActions): ReferralRankState => {
	switch (action.type) {
		case REFERRAL_RANKS_FETCH:
			return {
				...state,
				loading: true,
				error: undefined,
			};
		case REFERRAL_RANKS_DATA:
			const { payload, loading } = action.payload;
			return {
				...state,
				payload: payload,
				loading: loading,
				error: undefined,
			};
		default:
			return state;
	}
};
