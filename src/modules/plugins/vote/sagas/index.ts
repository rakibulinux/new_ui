import { takeLatest } from 'redux-saga/effects';
import { VOTE_DONATE_CREATE, VOTE_LIST_FETCH } from '../constants';
import { voteDonateCreateSaga, votesFetchSaga } from './voteSaga';

export function* rootVoteSaga() {
	yield takeLatest(VOTE_LIST_FETCH, votesFetchSaga);
	yield takeLatest(VOTE_DONATE_CREATE, voteDonateCreateSaga);
}
