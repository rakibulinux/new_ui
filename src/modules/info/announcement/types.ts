import { CommonState } from '../../../modules/types';

export interface Announcement {
    id: number;
    title: string;
    content: string;
    created_at: string;
    announcement_img_pc: string;
    announcement_img_mobile?:string
}


export interface AnnouncementState extends CommonState {
    data: Announcement[];
    loading: boolean;
}
