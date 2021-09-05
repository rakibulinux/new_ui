import { CommonError } from '../../../modules/types';
import { CLAIM_DATA, CLAIM_ERROR, CLAIM_FETCH, CLAIM_FETCH_USER_ID } from './constants';
import { ClaimState } from './types';

export interface ClaimFetch {
	type: typeof CLAIM_FETCH;
	payload: {
		airdrop_id: string;
	};
}

export interface ClaimFetchUserId {
	type: typeof CLAIM_FETCH_USER_ID;
	payload: {
		airdrop_id: string;
		user_uid: string;
	};
}

export interface ClaimData {
	type: typeof CLAIM_DATA;
	payload: ClaimState;
}

export interface ClaimError {
	type: typeof CLAIM_ERROR;
	error: CommonError;
}

export type ClaimActions = ClaimFetch | ClaimFetchUserId | ClaimData | ClaimError;

export const ClaimFetch = (payload: ClaimFetch['payload']): ClaimFetch => ({
	type: CLAIM_FETCH,
	payload,
});

export const claimFetchUserId = (payload: ClaimFetchUserId['payload']): ClaimFetchUserId => ({
	type: CLAIM_FETCH_USER_ID,
	payload,
});

export const ClaimData = (payload: ClaimData['payload']): ClaimData => ({
	type: CLAIM_DATA,
	payload,
});

export const ClaimError = (error: ClaimError['error']): ClaimError => ({
	type: CLAIM_ERROR,
	error,
});
