import { AnnouncementActions } from './actions';
import {
    ANNOUNCMENT_CREATE,
    ANNOUNCMENT_CREATE_DATA,
    ANNOUNCMENT_ERROR,
    ANNOUNCMENT_FETCH,
    ANNOUNCMENTS_DATA,
    ANNOUNCMENT_UPDATE,
    ANNOUNCMENT_UPDATE_DATA,
    ANNOUNCMENT_DELETE,
    ANNOUNCMENT_DELETE_DATA,
} from './constants';
import {
    AnnouncementState,
} from './types';

export const initialAnnouncement: AnnouncementState = {
    data: [],
    loading: false,
};

export const announcementReducer = (state = initialAnnouncement, action: AnnouncementActions): AnnouncementState => {
    switch (action.type) {
        case ANNOUNCMENT_CREATE:
            return {
                ...state,
                loading: true,
                error: undefined,
            };

        case ANNOUNCMENT_CREATE_DATA:
            state.data.unshift(action.payload);

            return {
                ...state,
                loading: false,
                error: undefined,
            };

        case ANNOUNCMENT_FETCH:
            return {
                ...state,
                loading: true,

            };

        case ANNOUNCMENTS_DATA:
            
            return {
                ...state,
                data : action.payload,
                loading: false,
            }
        
        case ANNOUNCMENT_UPDATE:
            return {
                ...state,
                loading: true,
                error: undefined,
            };
        case ANNOUNCMENT_UPDATE_DATA:
            const index = state.data.findIndex(item => item.id === action.payload.id)
            const data = [...state.data];
            data[index] = action.payload;
            return {
                ...state,
                data,
                loading: false,
            }
        case ANNOUNCMENT_DELETE:
            return {
                ...state,
                loading: true,
                error: undefined,
            };
        case ANNOUNCMENT_DELETE_DATA:
            let newData = [...state.data];
            newData = newData.filter(item => item.id !== action.payload.id);
            return {
                ...state,
                data: newData,
                loading: false,
            }
          
        case ANNOUNCMENT_ERROR:
            return {
                ...state,
                loading: false,
                error: action.error,
            };
        default:
            return state;
    }
};
