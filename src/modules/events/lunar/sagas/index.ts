import { takeLatest } from 'redux-saga/effects';
import {
    GET_LUNAR_AWARD,
    GET_LUNAR_LOTS,
    LUNAR_REWARD_DATA,
    POST_LUNAR_REWARD,
} from '../constants';
import { awardsFetchSaga,lotsFetchSaga,rewardPostSaga } from './lunarSaga';

export function* rootLunarSaga() {
    yield takeLatest(GET_LUNAR_AWARD, awardsFetchSaga);
    yield takeLatest(GET_LUNAR_LOTS, lotsFetchSaga);
    yield takeLatest(POST_LUNAR_REWARD, rewardPostSaga);
    yield takeLatest(LUNAR_REWARD_DATA, rewardPostSaga);
}
