import { notification } from 'antd';
import { put } from 'redux-saga/effects';
import pluginsAPI from '../../../../plugins/api';
import {
    awardData, awardError, AwardFetch, lotData,
    lotError,
    LotFetch, lunarError, rewardData, RewardPost,
} from '../actions';
import { Award, Lot } from './../types';

export function* awardsFetchSaga(action: AwardFetch) {
    try {
        const events = yield pluginsAPI.get<Award[]>('lunar-game/luckymoney/fetch');
        yield put(awardData(events.data.payload));
    } catch (error) {
        if (error.response.status === 404) {
            notification.open({
                type: 'error',
                message: '404',
            });
            yield put(awardError({
                code: error.response.status,
                message: error.response.data.msg,
            }));
        } else {
            yield put(awardError({
                code: error.response.status,
                message: error.response.data.msg,
            }));
        }
        notification.open({
            type: 'error',
            message: 'Sorry ...',
            description: error.response.data.error,
        });
    }
}

export function* lotsFetchSaga(action: LotFetch) {
    try {
        const events = yield pluginsAPI.get<Lot[]>(`lunar-game/luckylots/fetch/uid=${action.uid}`);
        yield put(lotData(events.data.payload));
    } catch (error) {
        if (error.response.status === 404) {
            notification.open({
                type: 'error',
                message: '404',
            });
            yield put(lotError({
                code: error.response.status,
                message: error.response.data.msg,
            }));
        } else {
            yield put(lotError({
                code: error.response.status,
                message: error.response.data.msg,
            }));
        }
        notification.open({
            type: 'error',
            message: 'Sorry ...',
            description: error.response.data.error,
        });
    }
}

export function* rewardPostSaga(action: RewardPost) {
    try {
        if (!action.payload.uid || !action.payload.txid) console.log('Uid or txid empty');
        else {
            const events = yield pluginsAPI.post(`lunar-game/reward/post/uid=${action.payload.uid}&txid=${action.payload.txid}`);
            action.payload.cb(events.data);
            yield put(rewardData(events.data));
        }
    } catch (error) {

        if (error.response.status === 404) {
            notification.open({
                type: 'error',
                message: '404',
            });
            yield put(lunarError({
                code: error.response.status,
                message: error.response.data.msg,
            }));
        } else {
            yield put(lunarError({
                code: error.response.status,
                message: error.response.data.msg,
            }));
        }
        notification.open({
            type: 'error',
            message: 'Sorry ...',
            description: error.response.data.error,
        });
    }
}
