import { put } from 'redux-saga/effects';
import axios from '../../../../plugins/api/index';

import { stakingListData, stakingListError, StakingListFetch } from '../actions';
import { Stake } from '../types';

export function* fetchStakingListSaga(action: StakingListFetch) {
	try {
		const stakingList = yield axios.get<Stake[]>('stake/list/fetch/all');
		yield put(
			stakingListData({
				payload: [...stakingList.data],
				loading: false,
			}),
		);
	} catch (error) {
		yield put(
			stakingListData({
				payload: [],
				loading: false,
			}),
		);
		yield put(stakingListError(error));
	}
}
