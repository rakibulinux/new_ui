import { takeLatest } from 'redux-saga/effects';
import { HOLDER_INFO_GET } from '..';
import { HOLDER_FETCH } from '../constants';
import { getHolderInfoSaga } from './holderInfo';
import { getHolderListSaga } from './holderList';

export function* rootHolderSaga() {
	yield takeLatest(HOLDER_FETCH, getHolderListSaga);
	yield takeLatest(HOLDER_INFO_GET, getHolderInfoSaga);
}
