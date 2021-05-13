import { takeLatest } from 'redux-saga/effects';
import {
	TRADING_RANKINGS_FETCH,
	//  sALE_FIND_BY_ID
} from '../constants';
import { tradingRankingsSaga } from './rankingsSaga';

export function* rootRankingsSaga() {
	yield takeLatest(TRADING_RANKINGS_FETCH, tradingRankingsSaga);
}
