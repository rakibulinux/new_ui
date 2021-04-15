import { takeLatest } from 'redux-saga/effects';
import {
    CLAIM_FETCH,
    CLAIM_FETCH_USER_ID
} from '../constants';
import { claimSaga, getClaimUserIdSaga } from './claimSaga';

export function* rootClaimSaga() {
    yield takeLatest(CLAIM_FETCH, claimSaga);
    yield takeLatest(CLAIM_FETCH_USER_ID, getClaimUserIdSaga);
}
