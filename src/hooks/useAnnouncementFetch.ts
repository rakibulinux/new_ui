import moment from 'moment';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { announcementFetch, selectAnnouncement, selectUserLoggedIn } from '../modules';

export const useAnnouncementFetch = (dateFormat = 'yyyy - MM - DD') => {
	const announcements = useSelector(selectAnnouncement);
	const userLoggedIn = useSelector(selectUserLoggedIn);
	const dispatch = useDispatch();

	React.useEffect(() => {
		if (userLoggedIn) {
			dispatch(announcementFetch());
		}
	}, [dispatch, userLoggedIn]);

	return announcements.data.map(_e => ({
		..._e,
		created_at: moment(_e.created_at).format(dateFormat),
	}));
};
