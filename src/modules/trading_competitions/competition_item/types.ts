import { CommonState } from '../../../modules/types';

export interface Competition {
  id: number;
  currency_id: string;
  currency_image: string;
  total_prize: string;
  market_ids: string[];
  next_update: string;
  start_date: string;
  end_date: string;
}

export interface CompetitionItemState extends CommonState {
  payload: Competition;
  loading: boolean;
}
