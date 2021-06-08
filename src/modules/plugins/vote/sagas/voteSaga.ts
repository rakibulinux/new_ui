import { API, RequestOptions } from 'api';
import { getCsrfToken } from 'helpers';
import { alertPush } from 'modules/public/alert';
import { stringify } from 'querystring';
import { call, put } from 'redux-saga/effects';
import { VoteDonateCreate, voteDonateData, VoteListData, voteListData, voteListError, VoteListFetch } from '../actions';

const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'sunshine', headers: { 'X-CSRF-Token': csrfToken } };
};

export function* votesFetchSaga(actions: VoteListFetch) {
	try {
		const voteList = yield call(API.get(createOptions()), `/public/vote/list?${stringify(actions.payload)}`);
		yield put(voteListData(voteList as VoteListData['payload']));
	} catch (error) {
		yield put(voteListError(error));
		yield put(alertPush({ message: [error.message], code: error.code, type: 'error' }));
	}
}

export function* voteDonateCreateSaga(actions: VoteDonateCreate) {
	try {
		yield call(API.post(createOptions(getCsrfToken())), `private/vote/donate`, actions.payload);
		yield put(voteDonateData(actions.payload));
		yield put(alertPush({ message: ['Vote success'], type: 'success' }));
	} catch (error) {
		yield put(voteListError(error));
		yield put(alertPush({ message: [error.message], code: error.code, type: 'error' }));
	}
}
