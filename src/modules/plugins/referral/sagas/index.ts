import { takeLatest } from 'redux-saga/effects';
import { COMMISION_HISTORY_FETCH, FRIENDS_LIST_FETCH, REFERRAL_RANKS_FETCH } from '../constants';
import { friendsFetchSaga } from './friends';
import { commisionHistoryFetch } from './history';
import { referralRanksFetch } from './ranks';

export function* rootReferralSaga() {
	yield takeLatest(FRIENDS_LIST_FETCH, friendsFetchSaga);
	yield takeLatest(COMMISION_HISTORY_FETCH, commisionHistoryFetch);
	yield takeLatest(REFERRAL_RANKS_FETCH, referralRanksFetch);
}
