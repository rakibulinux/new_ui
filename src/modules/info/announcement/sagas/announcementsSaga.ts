import { put } from 'redux-saga/effects';
// import { API, RequestOptions } from '../../../../../api';
import pluginsAPI from '../../../../plugins/api/index';
import { alertPush } from '../../../';
import {
	AnnouncementCreate,
	announcementError,
	AnnouncementFetch,
	announcementsData,
	AnnouncementUpdate,
	AnnouncementDelete,
	announcementFetch,
} from '../actions';
import { Announcement } from '../types';

export function* announcementCreateSaga(action: AnnouncementCreate) {
	try {
		yield pluginsAPI.post<Announcement>('announcement/create', action.payload);
		yield put(alertPush({ message: ['page.announcement.create.success'], type: 'success' }));
	} catch (error) {
		yield put(announcementError(error));
		yield put(alertPush({ message: ['page.announcement.create.fail'], type: 'error' }));
	}
}

export function* announcementFetchSaga(action: AnnouncementFetch) {
	try {
		const announcements = yield pluginsAPI.get<Announcement[]>('announcement/fetch');
		yield announcementFetch();
		yield put(announcementsData(announcements.data.announcements as Announcement[]));
	} catch (error) {
		yield put(announcementError(error));
	}
}

export function* announcementUpdateSaga(action: AnnouncementUpdate) {
	try {
		yield pluginsAPI.put<Announcement>('announcement/update/', action.payload);
	} catch (error) {
		yield put(announcementError(error));
	}
}
export function* announcementdeleteSaga(action: AnnouncementDelete) {
	try {
		yield pluginsAPI.delete('announcement/delete/' + action.payload.id);
		yield announcementFetch();
	} catch (error) {
		yield put(announcementError(error));
	}
}
