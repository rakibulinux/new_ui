import { RootState } from '../../../index';
import { IEOListState } from './types';

export const selectIEOList = (state: RootState): IEOListState => state.IEO.IEOList;
