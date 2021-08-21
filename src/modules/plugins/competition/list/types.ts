import { CommonState } from 'modules/types';

export interface NewCompetitionState {
	id: number;
	status: 'ongoing' | 'ended' | 'upcoming';
	currency_id: string;
	type: string;
	currency_image?: string;
	total_prize?: string;
	market_ids: string;
	next_update?: string;
	start_date: string;
	end_date: string;
	limit_display?: number;
}
export interface ListCompetitionState extends CommonState {
	payload: NewCompetitionState[];
	loading: boolean;
}
