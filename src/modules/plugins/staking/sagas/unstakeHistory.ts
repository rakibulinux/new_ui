import { put } from 'redux-saga/effects';
import { alertPush } from '../../..';
import axios from '../../../../plugins/api/index';

import { StakeHistoryFetch, unStakeHistoryData } from '../actions';
import { StakeHistory } from '../types';

export function* fetchUnStakeHistory(action: StakeHistoryFetch) {
	yield put(
		unStakeHistoryData({
			payload: [],
			loading: true,
		}),
	);
	try {
		const { uid } = action.payload;
		if (uid) {
			const histories = yield axios.get<StakeHistory[]>(`stake/history/unstake/fetch/uid=${uid}`);
			yield put(
				unStakeHistoryData({
					payload: [...histories.data],
					loading: false,
				}),
			);
		}
	} catch (error) {
		yield put(
			unStakeHistoryData({
				payload: [],
				loading: false,
			}),
		);
		yield put(alertPush({ message: error.message, code: error.code, type: 'error' }));
	}
}
