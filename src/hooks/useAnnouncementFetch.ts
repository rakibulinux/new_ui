import moment from 'moment';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { announcementFetch, selectAnnouncement } from '../modules';

export const useAnnouncementFetch = (dateFormat = 'yyyy - MM - DD') => {
	const announcements = useSelector(selectAnnouncement);
	const dispatch = useDispatch();

	React.useEffect(() => {
		if (!announcements.data.length) {
			dispatch(announcementFetch());
		}
	}, [dispatch]);

	return announcements.data.map(_e => ({
		..._e,
		created_at: moment(_e.created_at).format(dateFormat),
	}));
};
