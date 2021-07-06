import { CommonState } from '../../../../modules/types';

export interface BuyIEO {
	ieo_id: string;
	uid: string;
	quantity: number;
	total_purchase: number;
	quote_currency: string;
	success?: boolean;
}

export interface BuyIEOState extends CommonState {
	payload: BuyIEO;
	loading: boolean;
}

export interface TotalIEOBuyers {
	totalBuyers: number;
}

export interface TotalIEOBuyersState extends CommonState {
	payload: TotalIEOBuyers;
	loading: boolean;
}
