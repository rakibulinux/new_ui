import { CommonState } from '../../../../modules/types';

export interface DetailIEO {
	ieo_id: number | '';
	name: string;
	price: string;
	bonus: string;
	softcap: string;
	usage: string;
	tech: string;
	date: string;
	homepage: string;
	bonus_lockup: string;
	whitepaper: string;
	twitter: string;
	telegram: string;
	image: string;
	hardcap: string;
}

export interface DetailIEOState extends CommonState {
	loading: boolean;
	payload: DetailIEO;
}
