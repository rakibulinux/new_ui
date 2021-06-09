import { API, RequestOptions } from 'api';
import { getCsrfToken } from 'helpers';
import { alertPush } from 'modules/public/alert';
import { stringify } from 'querystring';
import { call, put } from 'redux-saga/effects';
import {
	VoteDonateCreate,
	voteDonateData,
	voteDonateError,
	voteHistoryData,
	VoteHistoryData,
	voteHistoryError,
	VoteListData,
	voteListData,
	voteListError,
	VoteListFetch,
} from '../actions';
import { VoteHistory } from '../types';

const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'sunshine', headers: { 'X-CSRF-Token': csrfToken } };
};

export function* voteListFetchSaga(actions: VoteListFetch) {
	try {
		const voteList = yield call(API.get(createOptions()), `/public/vote/list?${stringify(actions.payload)}`);
		yield put(voteListData(voteList as VoteListData['payload']));
	} catch (error) {
		yield put(voteListError(error));
		yield put(alertPush({ message: [error.message], code: error.code, type: 'error' }));
	}
}

export function* voteHistoryFetchSaga(actions: VoteListFetch) {
	try {
		const voteHistory = yield call(
			API.get(createOptions(getCsrfToken())),
			`/private/vote/history?${stringify(actions.payload)}`,
		);
		yield put(voteHistoryData(voteHistory as VoteHistoryData['payload']));
	} catch (error) {
		yield put(voteHistoryError(error));
		yield put(alertPush({ message: [error.message], code: error.code, type: 'error' }));
	}
}

export function* voteDonateCreateSaga(actions: VoteDonateCreate) {
	try {
		const donate = yield call(API.post(createOptions(getCsrfToken())), `private/vote/donate`, actions.payload);
		yield put(voteDonateData(donate as VoteHistory));
		yield put(alertPush({ message: ['Vote success'], type: 'success' }));
	} catch (error) {
		yield put(voteDonateError(error));
		yield put(alertPush({ message: [error.message], code: error.code, type: 'error' }));
	}
}
