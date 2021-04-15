import { takeLatest } from 'redux-saga/effects';
import {
     COMPETITION_FIND_BY_ID
} from '../constants';
import { findCompetitionByIdSaga } from './competitionItemSaga';

export function* rootcompetitionItemSaga() {
    yield takeLatest(COMPETITION_FIND_BY_ID, findCompetitionByIdSaga);

}
