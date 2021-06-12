import moment from 'moment';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { announcementFetch, selectAnnouncement } from '../../modules';

// tslint:disable-next-line: no-empty-interface
interface ProfileAnnouncementProps {}

export const ProfileAnnouncement: React.FC<ProfileAnnouncementProps> = () => {
	const announcements = useSelector(selectAnnouncement);
	const dispatch = useDispatch();

	React.useEffect(() => {
		dispatch(announcementFetch());
	}, []);

	return (
		<div className="td-pg-profile--bg td-pg-profile--radius td-pg-profile__content__item td-pg-profile__announcement">
			<Link to="/announcement" className="td-pg-profile__content__item__header td-pg-profile__content__item__header--link">
				<div className="td-pg-profile__content__item__header__title">Announcements</div>
				<div className="td-pg-profile__content__item__header__to-page">
					<svg width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M2.01986 0L0.609863 1.41L5.18986 6L0.609863 10.59L2.01986 12L8.01986 6L2.01986 0Z"
							fill="#848E9C"
						/>
					</svg>
				</div>
			</Link>
			<div className="td-pg-profile__content__item__content d-flex flex-column">
				{announcements.data.slice(0, 2).map((_a, i) => (
					<div className="td-pg-profile__announcement__item d-flex justify-content-between" key={i}>
						<div className="td-pg-profile__announcement__item__title flex-fill">
							<Link to={`/announcement/detail/${_a.id}`}>{_a.title}</Link>
						</div>
						<div className="td-pg-profile__announcement__item__date">
							{moment(_a.created_at).format('yyyy - MM - DD')}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
