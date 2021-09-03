import { takeLatest } from 'redux-saga/effects';
import { HOLDER_FETCH } from '../constants';
import { getHolderListSaga } from './holderList';

export function* rootHolderSaga() {
	yield takeLatest(HOLDER_FETCH, getHolderListSaga);
}
