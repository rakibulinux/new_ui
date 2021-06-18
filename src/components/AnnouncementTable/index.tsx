import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { useDispatch } from 'react-redux';
import { AnnouncementState, announcementFetch } from '../../modules';
import { announcementDelete } from '../../modules/info/announcement/actions';

const AnnouncementTableStyle = styled.div`
	margin-top: 5rem;
	table {
		width: 100%;
		border-spacing: 0;
		th,
		td {
			margin: 0;
			color: #fff;
			text-align: justify;
			padding-top: 15px;
			padding-bottom: 15px;
			padding-right: 10px;
			padding-left: 10px;
			transition: all 0.2s;
			background-color: var(--subheader-background-color);
		}
		tr {
			border-top: 1px solid #848e9c;
			display: flex;
		}
		th {
			color: #fff;
			background-color: var(--rgb-main-background-color);
			:nth-child(odd) {
				border-right: 1px solid #666;
				width: 70%;
			}
			:nth-child(even) {
				width: 30%;
			}
		}
		td {
			:nth-child(odd) {
				border-right: 1px solid #666;
				width: 70%;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
			}
			:nth-child(even) {
				display: flex;
				justify-content: center;
				width: 30%;
			}
		}
		th:not(:first-child) {
			text-align: center;
		}
		tr td:not(:first-child) {
			text-align: center;
		}
	}
`;
const TableEditstyle = styled.div`
	padding: 6px 20px;
	cursor: pointer;
	background-color: #64dfdf;
	:hover {
		background-color: #4895ef;
	}
`;
const TableDeletestyle = styled.div`
	padding: 6px 20px;
	cursor: pointer;
	background-color: #e07a5f;
	margin-right: 20px;
	:hover {
		background-color: #e85d04;
	}
`;
interface AnnouncementList {
	announcements: AnnouncementState;
}
export const AnnouncementTable: React.FC<AnnouncementList> = (props: AnnouncementList) => {
	const { announcements } = props;

	const dispatch = useDispatch();

	const handleDeleteAnnouncement = (id: number) => {
		dispatch(
			announcementDelete({
				id,
			}),
		);
		dispatch(announcementFetch());
	};

	return (
		<AnnouncementTableStyle>
			<table>
				<thead>
					<tr>
						<th>Heading</th>
						<th>Edit</th>
					</tr>
				</thead>
				<tbody>
					{announcements.data.map(announcement => (
						<tr>
							<td>{announcement.title}</td>
							<td>
								<TableDeletestyle onClick={() => handleDeleteAnnouncement(announcement.id)}>
									<DeleteOutlined />
								</TableDeletestyle>
								<TableEditstyle id={announcement.id.toString()}>
									<Link to={'/announcement/edit/' + announcement.id}>
										<EditOutlined />
									</Link>
								</TableEditstyle>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</AnnouncementTableStyle>
	);
};
