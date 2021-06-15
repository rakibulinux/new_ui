import { CommonError } from '../../../modules/types';
import {
	ANNOUNCMENT_CREATE,
	ANNOUNCMENT_CREATE_DATA,
	ANNOUNCMENT_DELETE,
	ANNOUNCMENT_DELETE_DATA,
	ANNOUNCMENT_ERROR,
	ANNOUNCMENT_FETCH,
	ANNOUNCMENT_UPDATE,
	ANNOUNCMENT_UPDATE_DATA,
	ANNOUNCMENTS_DATA,
} from './constants';
import {
	Announcement,
} from './types';

export interface AnnouncementUpdate {
	type: typeof ANNOUNCMENT_UPDATE;
	payload: {
		id : string,
		content : string;
		title : string;
		announcement_img_pc: string;
	};
}
export interface AnnouncementDelete {
	type: typeof ANNOUNCMENT_DELETE;
	payload: {
		id : number,
	};
}

export interface AnnouncementCreate {
	type: typeof ANNOUNCMENT_CREATE;
	payload: {
		title: string;
		content: string;
		announcement_img_pc: string;
	};
}

export interface AnnouncementCreateData {
	type: typeof ANNOUNCMENT_CREATE_DATA;
	payload: Announcement;
}

export interface AnnouncementUpdateData {
	type: typeof ANNOUNCMENT_UPDATE_DATA;
	payload: Announcement;
}

export interface AnnouncementDeleteData {
	type: typeof ANNOUNCMENT_DELETE_DATA;
	payload: {
		id : number,
	};
}

export interface AnnouncementsData {
	type: typeof  ANNOUNCMENTS_DATA;
	payload: Announcement[];
}

export interface AnnouncementFetch {
	type: typeof ANNOUNCMENT_FETCH;
}

export interface AnnouncementError {
	type: typeof ANNOUNCMENT_ERROR;
	error: CommonError;
}

export type AnnouncementActions =
AnnouncementCreate | AnnouncementUpdateData
	| AnnouncementError | AnnouncementFetch  | AnnouncementsData | AnnouncementUpdate | AnnouncementCreateData
		| AnnouncementDelete | AnnouncementDeleteData
	;

export const announcementFetch = (): AnnouncementFetch => ({
	type: ANNOUNCMENT_FETCH,
});

export const announcementsData = (payload: Announcement[]): AnnouncementsData => ({
	type: ANNOUNCMENTS_DATA,
	payload,
});
export const announcementUpdateData = (payload:Announcement): AnnouncementUpdateData => ({
	type: ANNOUNCMENT_UPDATE_DATA,
	payload,
});

export const announcementUpdate = (payload:AnnouncementUpdate['payload']):AnnouncementUpdate => ({
	type: ANNOUNCMENT_UPDATE,
	payload,
});

export const announcementDeleteData = (payload: AnnouncementDeleteData['payload']): AnnouncementDeleteData => ({
	type: ANNOUNCMENT_DELETE_DATA,
	payload,
});

export const announcementDelete = (payload:AnnouncementDelete['payload']):AnnouncementDelete => ({
	type: ANNOUNCMENT_DELETE,
	payload,
});

export const announcementCreate = (payload:AnnouncementCreate['payload']):AnnouncementCreate => ({
	type: ANNOUNCMENT_CREATE,
	payload,
});

export const announcementCreateData = (payload:AnnouncementCreateData['payload']):AnnouncementCreateData => ({
	type: ANNOUNCMENT_CREATE_DATA,
	payload,
});


export const announcementError = (error: AnnouncementError['error']): AnnouncementError => ({
	type: ANNOUNCMENT_ERROR,
	error,
});
