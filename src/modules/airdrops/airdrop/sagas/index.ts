import { takeLatest } from 'redux-saga/effects';
import {
    AIRDROP_FETCH, AIRDROP_FETCH_ID, AIRDROP_WAITING_FETCH, AIRDROP_OPENING_FETCH, AIRDROP_DELIVERING_FETCH, AIRDROP_DELIVERED_FETCH
} from '../constants';
import { airdropSaga, airdropIdSaga, waitingAirdropSaga, openingAirdropSaga, deliveredAirdropSaga, deliveringAirdropSaga } from './airdropSaga';

export function* rootAirdropSaga() {
    yield takeLatest(AIRDROP_FETCH, airdropSaga);
    yield takeLatest(AIRDROP_WAITING_FETCH, waitingAirdropSaga);
    yield takeLatest(AIRDROP_OPENING_FETCH, openingAirdropSaga);
    yield takeLatest(AIRDROP_DELIVERING_FETCH, deliveringAirdropSaga);
    yield takeLatest(AIRDROP_DELIVERED_FETCH, deliveredAirdropSaga);
    yield takeLatest(AIRDROP_FETCH_ID, airdropIdSaga);
}
