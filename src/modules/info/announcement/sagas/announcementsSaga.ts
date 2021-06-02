import { put } from 'redux-saga/effects';
// import { API, RequestOptions } from '../../../../../api';
import pluginsAPI from '../../../../plugins/api/index';

import {
    AnnouncementCreate,
    announcementUpdateData,
    // announcementCreateData,
    announcementError,
    AnnouncementFetch,
    announcementsData,
    AnnouncementUpdate,
    AnnouncementDelete,
    announcementDeleteData
} from '../actions';
import { Announcement } from '../types';


export function* announcementCreateSaga(action: AnnouncementCreate) {
    try {
        yield pluginsAPI.post<Announcement>('announcement/create', action.payload);
	
    } catch (error) {
        yield put(announcementError(error));
    }
}

export function* announcementFetchSaga(action: AnnouncementFetch) {
    try {
        const announcements = yield pluginsAPI.get<Announcement[]>('announcement/fetch');
        yield put(announcementsData(announcements.data.announcements as Announcement[]));
    } catch (error) {
        yield put(announcementError(error));
    }
}

export function* announcementUpdateSaga(action: AnnouncementUpdate) {
    try {
        const announcements = yield pluginsAPI.put<Announcement>('announcement/update/', action.payload);
        yield put(announcementUpdateData(announcements.data.announcement as Announcement));
    } catch (error) {
        yield put(announcementError(error));
    }
}
export function* announcementdeleteSaga(action: AnnouncementDelete) {
    try {
        yield pluginsAPI.delete('announcement/delete/'+action.payload.id);
        yield put(announcementDeleteData({id : action.payload.id}));
    } catch (error) {
        yield put(announcementError(error));
    }
}
