import { put, call } from 'redux-saga/effects';
import { API, RequestOptions } from 'api';
import { getCsrfToken } from 'helpers';
import { catchErrorCompetitionVolume, FetchCompetitionVolume, getDataCompetitionVolume } from '../actions';
const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'competition', headers: { 'X-CSRF-Token': csrfToken } };
};

export function* competitionVolumeSaga(action: FetchCompetitionVolume) {
	try {
		const { id, typeCompetition } = action;
		const ranking = yield call(
			API.get(createOptions(getCsrfToken())),
			`/private/competition/volume/type=${typeCompetition}&&competition_id=${id}`,
		);
		yield put(getDataCompetitionVolume(ranking, false));
	} catch (error) {
		yield put(catchErrorCompetitionVolume(error));
	}
}
