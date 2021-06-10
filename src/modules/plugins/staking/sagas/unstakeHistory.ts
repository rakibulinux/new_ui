import { put } from 'redux-saga/effects';
import axios from '../../../../plugins/api/index';

import { unStakeHistoryData, UnStakeHistoryFetch } from '../actions';
import { StakeHistory } from '../types';

export function* fetchUnStakeHistory(action: UnStakeHistoryFetch) {
	yield put(
		unStakeHistoryData({
			payload: [],
			loading: true,
		}),
	);
	try {
		const { uid, currency_id } = action.payload;
		if (uid && currency_id) {
			const histories = yield axios.get<StakeHistory[]>(
				`stake/history/unstake/fetch/uid=${uid}/currency_id=${currency_id}`,
			);
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
	}
}
