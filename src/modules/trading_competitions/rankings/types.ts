import { CommonState } from '../../../modules/types';
export interface TradingRanking {
	rank: number;
	uid: string;
	email: string;
	volumn: string;
}
export interface TradingRankingsState extends CommonState {
	payload: TradingRanking[];
	loading: boolean;
}
