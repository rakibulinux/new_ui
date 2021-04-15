import { takeLatest } from 'redux-saga/effects';
import {
    COMPETITION_LIST_FETCH
} from '../constants';
import { competionsListFetchSaga } from './competitionsSaga';

export function* rootCompetionsListSaga() {
    yield takeLatest(COMPETITION_LIST_FETCH, competionsListFetchSaga);

}
