import { FetchCompetitionItem } from '../actions';
import { put, call } from 'redux-saga/effects';
import { API, RequestOptions } from 'api';
import { getCsrfToken } from 'helpers';
const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'competition', headers: { 'X-CSRF-Token': csrfToken } };
};

export function* competitionItemSaga(action: FetchCompetitionItem) {
	try {
		const {};
		const competitionList = yield call(API.get(createOptions(getCsrfToken())), '/public/competition/:');
		yield put(listCompetitionData(competitionList));
	} catch (error) {
		yield put(listCompetitionError(error));
	}
}
