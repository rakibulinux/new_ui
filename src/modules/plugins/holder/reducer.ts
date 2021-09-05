import { HolderInfoActions, HolderInfoState, HolderListState, HOLDER_INFO_DATA, HOLDER_INFO_GET } from '.';
import { HolderListActions } from './actions';
import { HOLDER_DATA, HOLDER_FETCH } from './constants';

const initialHolderListState: HolderListState = {
	payload: [0, []],
	loading: true,
};

export const holderListReducer = (state = initialHolderListState, action: HolderListActions) => {
	switch (action.type) {
		case HOLDER_FETCH:
			return {
				...state,
				loading: true,
				error: undefined,
			};
		case HOLDER_DATA:
			const { payload } = action.payload;

			return {
				...state,
				payload: payload,
				loading: false,
				error: undefined,
			};

		default:
			return state;
	}
};

const initialHolderInfoState: HolderInfoState = {
	payload: null,
	loading: true,
};

export const holderInfoReducer = (state = initialHolderInfoState, action: HolderInfoActions) => {
	switch (action.type) {
		case HOLDER_INFO_GET:
			return {
				...state,
				loading: true,
				error: undefined,
			};
		case HOLDER_INFO_DATA:
			const { payload } = action.payload;

			return {
				...state,
				payload: payload,
				loading: false,
				error: undefined,
			};

		default:
			return state;
	}
};
