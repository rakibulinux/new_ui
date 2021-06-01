import axios from 'plugins/api/vote';
import { stringify } from 'querystring';
import { put } from 'redux-saga/effects';
import { voteListData, voteListError, VoteListFetch } from '../actions';
import { VoteCoin } from '../types';

export function* votesFetchSaga(actions: VoteListFetch) {
	try {
		const votes = yield axios.get<VoteCoin[]>(`/vote/list?${stringify(actions.payload)}`);
		yield put(
			voteListData({
				data: votes.data.data as VoteCoin[],
				total: votes.data.total,
			}),
		);
	} catch (error) {
		yield put(voteListError(error));
	}
}
