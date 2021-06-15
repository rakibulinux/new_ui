import { takeLatest } from 'redux-saga/effects';
import {
	ANNOUNCMENT_CREATE, ANNOUNCMENT_DELETE, ANNOUNCMENT_FETCH, ANNOUNCMENT_UPDATE,
} from '../constants';
import { announcementCreateSaga, announcementdeleteSaga, announcementFetchSaga, announcementUpdateSaga} from './announcementsSaga';

export function* rootAnnouncementSaga() {
	yield takeLatest(ANNOUNCMENT_CREATE, announcementCreateSaga);
	yield takeLatest(ANNOUNCMENT_FETCH, announcementFetchSaga);
	yield takeLatest(ANNOUNCMENT_UPDATE, announcementUpdateSaga);
	yield takeLatest(ANNOUNCMENT_DELETE, announcementdeleteSaga);

}
