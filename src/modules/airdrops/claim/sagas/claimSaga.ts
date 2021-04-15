import { put } from 'redux-saga/effects';
// import { API, RequestOptions } from '../../../../../api';
import axios from '../../../../plugins/api/index';

import {
    ClaimData,
    ClaimError,
    ClaimFetch,
    ClaimFetchUserId
} from '../actions';
import { Claim } from '../types';


export function* claimSaga(action: ClaimFetch) {
    try {
        const claim = yield axios.get<Claim>(`claim/fetch/all/${action.payload.airdrop_id}`);
        yield put(ClaimData(claim.data));
    } catch (error) {
        yield put(ClaimError(error));
    }
}

export function* getClaimUserIdSaga(action: ClaimFetchUserId) {
    try {
        const airdrop = yield axios.get<Claim>(`claim/getByUid/airdrop_id=${action.payload.airdrop_id}&user_uid=${action.payload.user_uid}`);
        yield put(ClaimData(airdrop.data));
    } catch (error) {
        yield put(ClaimError(error));
    }
}

