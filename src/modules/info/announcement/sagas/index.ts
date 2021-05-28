import { takeLatest } from 'redux-saga/effects';
import {
    ANNOUNCMENT_CREATE, ANNOUNCMENT_FETCH, ANNOUNCMENT_UPDATE, ANNOUNCMENT_DELETE,
} from '../constants';
import { announcementCreateSaga, announcementFetchSaga, announcementUpdateSaga, announcementdeleteSaga} from './announcementsSaga';

export function* rootAnnouncementSaga() {
    yield takeLatest(ANNOUNCMENT_CREATE, announcementCreateSaga);
    yield takeLatest(ANNOUNCMENT_FETCH, announcementFetchSaga);
    yield takeLatest(ANNOUNCMENT_UPDATE, announcementUpdateSaga);
    yield takeLatest(ANNOUNCMENT_DELETE, announcementdeleteSaga);

}
