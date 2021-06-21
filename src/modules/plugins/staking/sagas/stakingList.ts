import { API, RequestOptions } from 'api';
import { call, put } from 'redux-saga/effects';

import { stakingListData, stakingListError, StakingListFetch } from '../actions';

const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'sunshine', headers: { 'X-CSRF-Token': csrfToken } };
};

export function* fetchStakingListSaga(action: StakingListFetch) {
	try {
		const list = yield call(API.get(createOptions()), `/public/stake/list`);
		yield put(
			stakingListData({
				payload: [...list.rows],
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
