import { takeLatest } from 'redux-saga/effects';
import { HISTORY_ALL_FETCH, HISTORY_FETCH, HISTORY_PUSH_EMIT } from '../constants';
import { historyAllDataSaga } from './historyAllDataSage';
import { historyPushSaga } from './historyPushSaga';
import { historySaga } from './historySaga';

export function* rootHistorySaga() {
	yield takeLatest(HISTORY_PUSH_EMIT, historyPushSaga);
	yield takeLatest(HISTORY_FETCH, historySaga);
	yield takeLatest(HISTORY_ALL_FETCH, historyAllDataSaga);
}
