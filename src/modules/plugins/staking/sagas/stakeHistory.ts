import { put } from 'redux-saga/effects';
import axios from '../../../../plugins/api/index';

import { stakeHistoryData, StakeHistoryFetch } from '../actions';
import { StakeHistory } from '../types';

export function* fetchStakeHistory(action: StakeHistoryFetch) {
	yield put(
		stakeHistoryData({
			payload: [],
			loading: true,
		}),
	);
	try {
		const { uid, stake_id } = action.payload;
		if (uid && stake_id) {
			const histories = yield axios.get<StakeHistory[]>(`stake/history/stake/fetch/uid=${uid}/stake_id=${stake_id}`);
			yield put(
				stakeHistoryData({
					payload: [...histories.data],
					loading: false,
				}),
			);
		}
	} catch (error) {
		yield put(
			stakeHistoryData({
				payload: [],
				loading: false,
			}),
		);
	}
}
