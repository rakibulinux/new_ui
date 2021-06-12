import { stakeWalletFetch, unStakeHistoryFetch } from './../actions';
import { alertPush } from './../../../public/alert/actions';
import { put } from 'redux-saga/effects';
import pluginAPI from '../../../../plugins/api';

import { unStakeData, UnstakePost } from '../actions';

export function* unstakeSaga(action: UnstakePost) {
	try {
		const { uid, currency_id, amount } = action.payload;
		const unstake_data = {
			uid,
			currency_id,
			amount,
		};
		const result = yield pluginAPI.post('stake/unstake', unstake_data);
		if (result.data.error) throw new Error(result.data.error);
		yield put(unStakeHistoryFetch({ uid: uid, currency_id: currency_id }));
		yield put(
			stakeWalletFetch({
				uid: uid,
				currency_id: currency_id,
			}),
		);
		yield put(alertPush({ message: ['unstake.success'], type: 'success' }));
	} catch (error) {
		yield put(alertPush({ message: [error.message], type: 'error' }));
	}
	yield put(
		unStakeData({
			loading: false,
		}),
	);
}
