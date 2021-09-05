import { RootState } from '../../../index';
import { DetailIEOState } from './types';

export const selectIEODetail = (state: RootState): DetailIEOState => state.IEO.ieoDetail;
