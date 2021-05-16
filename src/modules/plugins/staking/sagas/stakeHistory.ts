import { put } from 'redux-saga/effects';
import { alertPush } from '../../..';
import axios from '../../../../plugins/api/index';

import { stakeHistoryData, StakeHistoryFetch } from '../actions';
import { StakeHistory } from '../types';

export function* fetchStakeHistory(action: StakeHistoryFetch) {
	try {
		yield put(
			stakeHistoryData({
				payload: [],
				loading: true,
			}),
		);
		const { uid } = action.payload;
		if (uid) {
			const histories = yield axios.get<StakeHistory[]>(`staking/history/fetch/uid=${uid}`);
			yield put(
				stakeHistoryData({
					payload: histories.data,
					loading: false,
				}),
			);
		}
	} catch (error) {
		yield put(alertPush({ message: error.message, code: error.code, type: 'error' }));
	}
}
