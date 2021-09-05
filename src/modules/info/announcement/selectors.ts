import { RootState } from '../../index';
import { AnnouncementState } from './types';

export const selectAnnouncement = (state: RootState): AnnouncementState => state.info.announcement;
