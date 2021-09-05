// import { sliceArray } from '../../../../helpers';
import { ClaimActions } from './actions';
import { CLAIM_DATA, CLAIM_ERROR, CLAIM_FETCH, CLAIM_FETCH_USER_ID } from './constants';
import { ClaimState } from './types';

export const initialClaim: ClaimState = {
	payload: [],
	loading: false,
};

export const claimReducer = (state = initialClaim, action: ClaimActions): ClaimState => {
	switch (action.type) {
		case CLAIM_FETCH:
			return {
				...state,
				loading: true,
				error: undefined,
			};
		case CLAIM_FETCH_USER_ID:
			return {
				...state,
				loading: true,
				error: undefined,
			};
		case CLAIM_DATA:
			const { payload } = action.payload;

			return {
				...state,
				payload: payload,
				loading: false,
				error: undefined,
			};
		case CLAIM_ERROR:
			return {
				...state,
				loading: false,
				error: action.error,
			};
		default:
			return state;
	}
};
