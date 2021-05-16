import { put } from 'redux-saga/effects';
// import { API, RequestOptions } from '../../../../../api';
import axios from '../../../../plugins/api/index';

import { stakingListData, stakingListError, StakingListFetch } from '../actions';
import { Stake } from '../types';

export function* fetchStakingListSaga(action: StakingListFetch) {
	try {
		yield put(
			stakingListData({
				payload: [],
				loading: true,
			}),
		);
		const stakingList = yield axios.get<Stake[]>('staking/list/fetch/all');
		console.log(stakingList.data);

		yield put(
			stakingListData({
				payload: [...stakingList.data],
				loading: false,
			}),
		);
	} catch (error) {
		yield put(stakingListError(error));
	}
}
