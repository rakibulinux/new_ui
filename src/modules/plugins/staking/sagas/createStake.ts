import { put } from 'redux-saga/effects';
import axios from '../../../../plugins/api/index';
import { alertPush } from './../../../public/alert/actions';
import { stakeHistoryFetch, stakingListFetch } from './../actions';

import { CreateStake, createStakeData } from '../actions';

export function* createStakeSaga(action: CreateStake) {
	try {
		const { uid, reward_id, amount, lockup_date, release_date, stake_id } = action.payload;
		const stake_data = {
			uid: uid,
			reward_id: reward_id,
			amount: amount,
			lockup_date: lockup_date,
			release_date: release_date,
		};
		const result = yield axios.post('stake/stakes', stake_data);
		if (result.data.error) { throw new Error(result.data.error); }
		yield put(stakingListFetch());
		yield put(stakeHistoryFetch({ uid: uid, stake_id: stake_id }));
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
