import { put } from 'redux-saga/effects';
// import { API, RequestOptions } from '../../../../../api';
import axios from '../../../../plugins/api/index';

import {
    airdropData,
    airdropError,
    AirdropFetchId,
    AirdropFetch,
    WaitingAirdropFetch,
    OpeningAirdropFetch,
    DeliveringAirdropFetch,
    DeliveredAirdropFetch
} from '../actions';
import { Airdrop } from '../types';


export function* airdropSaga(action: AirdropFetch) {
    try {
        const airdrop = yield axios.get<Airdrop>('airdrop/fetch');
        yield put(airdropData(airdrop.data));
    } catch (error) {
        yield put(airdropError(error));
    }
}

export function* waitingAirdropSaga(action: WaitingAirdropFetch) {
    try {
        const airdrop = yield axios.get<Airdrop>(`airdrop/fetch/waiting/page=${action.payload.page - 1}&size=${action.payload.size}`);
        yield put(airdropData(airdrop.data));
    } catch (error) {
        yield put(airdropError(error));
    }
}

export function* openingAirdropSaga(action: OpeningAirdropFetch) {
    try {
        const airdrop = yield axios.get<Airdrop>(`airdrop/fetch/opening/page=${action.payload.page - 1}&size=${action.payload.size}`);
        yield put(airdropData(airdrop.data));
    } catch (error) {
        yield put(airdropError(error));
    }
}

export function* deliveringAirdropSaga(action: DeliveringAirdropFetch) {
    try {
        const airdrop = yield axios.get<Airdrop>(`airdrop/fetch/delivering/page=${action.payload.page - 1}&size=${action.payload.size}`);
        yield put(airdropData(airdrop.data));
    } catch (error) {
        yield put(airdropError(error));
    }
}

export function* deliveredAirdropSaga(action: DeliveredAirdropFetch) {
    try {
        const airdrop = yield axios.get<Airdrop>(`airdrop/fetch/delivered/page=${action.payload.page - 1}&size=${action.payload.size}`);
        yield put(airdropData(airdrop.data));
    } catch (error) {
        yield put(airdropError(error));
    }
}

export function* airdropIdSaga(action: AirdropFetchId) {
    try {
        const airdrop = yield axios.get<Airdrop>('airdrop/fetch/' + action.payload.id);
        yield put(airdropData(airdrop.data));
    } catch (error) {
        yield put(airdropError(error));
    }
}
