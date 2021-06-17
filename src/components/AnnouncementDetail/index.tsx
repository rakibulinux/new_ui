import * as React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { selectAnnouncement } from '../../modules';
import { HotAnnouncement } from '../';

const AnnouncementDetailStyle = styled.div`
	margin-top: 1rem;
	margin-bottom: 10rem;
	.container {
		max-width: 1340px;
		width: 100%;
	}
`;

const AnnouncementItemDetail = styled.div`
	padding: 0px;
`;

const AnnouncementTitleStyle = styled.h2`
	font-size: 22px;
	color: #81cdf9;
	padding: 20px;
	margin-bottom: 26px;
	background-color: rgb(49, 52, 69);
`;

const AnnouncementDetailContentStyle = styled.div`
	background-color: rgb(49, 52, 69);
	padding: 20px;

	p,
	div {
		font-size: 14px;
		color: #fff;
		margin-bottom: 0;
	}
`;
const AnnouncementBannerStyle = styled.div`
	width: 100%;
	max-height: 300px;
	overflow: hidden;
	margin-bottom: 26px;

	img {
		width: 100%;
		max-height: 300px;
		background-repeat: no-repeat;
		background-size: auto;
		object-fit: cover;
	}
`;

export const AnnouncementDetail: React.FC = () => {
	const { id } = useParams<any>(); // id announcement
	const announcements = useSelector(selectAnnouncement);
	const announcementDetail = announcements.data.filter(announcement => announcement.id === Number(id));

	return (
		<React.Fragment>
			<AnnouncementDetailStyle>
				<div className="container">
					<div className="row">
						<div className="col-md-8">
							<AnnouncementItemDetail>
								{announcementDetail.map((announcement, index) => (
									<React.Fragment key={index}>
										<AnnouncementBannerStyle>
											<img src={announcement.announcement_img_pc} alt="" />
										</AnnouncementBannerStyle>
										<AnnouncementTitleStyle>{announcement.title}</AnnouncementTitleStyle>
										<AnnouncementDetailContentStyle>
											<p style={{ marginBottom: '20px' }}>Dear All,</p>
											<div dangerouslySetInnerHTML={{ __html: announcement.content }}></div>
											<p style={{ margin: '20px 0' }}>Thanks</p>
											<div>{announcement.created_at.split('T', 1)}</div>
										</AnnouncementDetailContentStyle>
									</React.Fragment>
								))}
							</AnnouncementItemDetail>
						</div>
						<div className="col-md-4">
							<div style={{ background: 'rgb(49, 52, 69)' }}>
								<HotAnnouncement />
							</div>
						</div>
					</div>
				</div>
			</AnnouncementDetailStyle>
		</React.Fragment>
	);
};
