import { takeLatest } from 'redux-saga/effects';
import { VOTE_LIST_FETCH } from '../constants';
import { votesFetchSaga } from './voteSaga';

export function* rootVoteSaga() {
	yield takeLatest(VOTE_LIST_FETCH, votesFetchSaga);
}
