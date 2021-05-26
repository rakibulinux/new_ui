import { alertPush } from './../../../public/alert/actions';
import { put } from 'redux-saga/effects';
import axios from '../../../../plugins/api/index';

import { CreateStake, createStakeData } from '../actions';

export function* createStakeSaga(action: CreateStake) {
	yield put(
		createStakeData({
			loading: true,
		}),
	);
	try {
		const { uid, reward_id, amount, lockup_date, release_date } = action.payload;
		const stake_data = {
			uid: uid,
			reward_id: reward_id,
			amount: amount,
			lockup_date: lockup_date,
			release_date: release_date,
		};
		const result = yield axios.post('stake/stakes', stake_data);
		if (result.data.error) throw new Error(result.data.error);

		yield put(alertPush({ message: ['create.stake.success'], type: 'success' }));
	} catch (error) {
		yield put(alertPush({ message: [error.message], type: 'error' }));
	}
	yield put(
		createStakeData({
			loading: false,
		}),
	);
}
