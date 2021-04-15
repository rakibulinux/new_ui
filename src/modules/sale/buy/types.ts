import { CommonState } from '../../../modules/types';

export interface Buy {
  ieo_id: string;
  uid: string;
  quantity: number;
  total_purchase: number;
  quote_currency: string;
  success?: boolean;
}

export interface BuyState extends CommonState {
  payload: Buy;
  loading: boolean;
}

export interface TotalBuyers {
  totalBuyers: number;
}

export interface TotalBuyersState extends CommonState {
  payload: TotalBuyers;
  loading: boolean;
}
