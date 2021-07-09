import * as React from 'react';
import { Link } from 'react-router-dom';
import { useAnnouncementFetch } from '../../hooks';
// tslint:disable-next-line: no-empty-interface
interface ProfileAnnouncementProps {}

export const ProfileAnnouncement: React.FC<ProfileAnnouncementProps> = () => {
	const announcements = useAnnouncementFetch();

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
				{announcements.slice(0, 2).map((_e, i) => (
					<div className="td-pg-profile__announcement__item d-flex justify-content-between" key={i}>
						<div className="td-pg-profile__announcement__item__title flex-fill">
							<Link to={`/announcement/detail/${_e.id}`}>{_e.title}</Link>
						</div>
						<div className="td-pg-profile__announcement__item__date">{_e.created_at}</div>
					</div>
				))}
			</div>
		</div>
	);
};
