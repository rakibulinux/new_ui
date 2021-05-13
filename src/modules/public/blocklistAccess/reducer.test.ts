import * as actions from './actions';
import { blocklistAccessReducer, initialBlocklistAccessState } from './reducer';

describe('blacklistCountryReducer', () => {
	it('should handle SEND_BLOCKLIST_ACCESS_TOKEN_FETCH', () => {
		const expectedState = {
			...initialBlocklistAccessState,
			loading: true,
			error: false,
		};
		expect(blocklistAccessReducer(initialBlocklistAccessState, actions.sendAccessToken({ whitelink_token: '' }))).toEqual(
			expectedState,
		);
	});

	it('should handle SEND_BLOCKLIST_ACCESS_TOKEN_DATA', () => {
		const expectedState = {
			...initialBlocklistAccessState,
			loading: false,
			success: true,
		};
		expect(blocklistAccessReducer(initialBlocklistAccessState, actions.sendAccessTokenData())).toEqual(expectedState);
	});

	it('should handle SEND_BLOCKLIST_ACCESS_TOKEN_ERROR', () => {
		const expectedState = {
			...initialBlocklistAccessState,
			loading: false,
			error: true,
		};
		expect(blocklistAccessReducer(initialBlocklistAccessState, actions.sendAccessTokenError())).toEqual(expectedState);
	});

	it('should handle SET_BLOCKLIST_STATUS', () => {
		const payload = {
			status: '',
		};
		const expectedState = {
			...initialBlocklistAccessState,
			status: payload.status,
		};
		expect(blocklistAccessReducer(initialBlocklistAccessState, actions.setBlocklistStatus(payload))).toEqual(expectedState);
	});
});
