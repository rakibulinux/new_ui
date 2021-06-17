import * as React from 'react';
import { Row, Col } from 'antd';
import { HotAnnouncement, PaginationAnnouncement } from '../../components';
import { announcementFetch, selectUserInfo, selectAnnouncement } from '../../modules';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export const AnnouncementContainer: React.FC = () => {
	const user = useSelector(selectUserInfo);
	const announcements = useSelector(selectAnnouncement);

	const role = user.role;
	const dispatch = useDispatch();

	const [paginationState, setPaginationState] = React.useState({
		current: 1,
		pageSize: 10,
		total: 0,
	});

	const handleGetStartPointPagination = React.useCallback((): number => {
		const start = paginationState.pageSize * paginationState.current - paginationState.pageSize;
		return start;
	}, [paginationState]);

	React.useEffect(() => {
		if (announcements) {
			setPaginationState(prev => ({
				...prev,
				total: announcements.data.length,
			}));
		}
	}, [announcements.data.length, announcements]);

	React.useEffect(() => {
		handleGetStartPointPagination();
	}, [paginationState, handleGetStartPointPagination]);

	React.useEffect(() => {
		dispatch(announcementFetch());
	}, [dispatch]);
	const rendenCreatAnnouncement = () => {
		if (role === 'superadmin') {
			return (
				<Link style={{ padding: '10px 20px', backgroundColor: '#81cdf9' }} to="/announcement/create">
					Creat Announcement
				</Link>
			);
		} else {
			return <React.Fragment></React.Fragment>;
		}
	};

	const renderPagination = () => {
		const { current, pageSize, total } = paginationState;

		return (
			<PaginationAnnouncement
				onClickToPage={onClickToPage}
				page={current}
				onClickNextPage={onClickNextPage}
				onClickPrevPage={onClickPrevPage}
				onClickFirstPage={onClickFirstPage}
				onClickLastPage={onClickLastPage}
				firstElemIndex={1}
				lastElemIndex={Math.ceil(total / pageSize)}
			/>
		);
	};

	const onClickPrevPage = () => {
		setPaginationState(prev => ({
			...prev,
			current: prev.current - 1,
		}));
	};

	const onClickNextPage = () => {
		setPaginationState(prev => ({
			...prev,
			current: prev.current + 1,
		}));
	};

	const onClickToPage = (value: number) => {
		setPaginationState(prev => ({
			...prev,
			current: value,
		}));
	};
	const onClickFirstPage = () => {
		setPaginationState(prev => ({
			...prev,
			current: 1,
		}));
	};
	const onClickLastPage = () => {
		const { pageSize, total } = paginationState;
		setPaginationState(prev => ({
			...prev,
			current: Math.ceil(total / pageSize),
		}));
	};

	return (
		<div className="body-announcement mt-3 mb-5">
			<div className="container">
				<Row className="mt-5">
					<Col>{rendenCreatAnnouncement()}</Col>
				</Row>

				<Row gutter={[12, 0]} className="mt-5">
					<Col className="left__article" span={16}>
						<div className="left__article-Box">
							<div className="article mb-4">
								{announcements.data
									.slice(
										handleGetStartPointPagination(),
										handleGetStartPointPagination() + paginationState.pageSize,
									)
									.map((announcement, index) => {
										return (
											<div className="article-item">
												<h3 className="article-item__title">
													<Link
														to={'/announcement/detail/' + announcement.id}
														className="article-item__title-link"
													>
														{announcement.title}
													</Link>
												</h3>
												<div
													className="article-item__content"
													dangerouslySetInnerHTML={{ __html: announcement.content }}
												></div>
												<div className="article-item__time">
													<span className="time">{announcement.created_at.split('T', 1)}</span>
												</div>
											</div>
										);
									})}
							</div>
							<div className="pg-ticker-table__pagination">{renderPagination()}</div>
						</div>
					</Col>

					<Col className="right__article" span={8}>
						<div className="right__article-Box">
							<HotAnnouncement />
						</div>
					</Col>
				</Row>
			</div>
		</div>
	);
};
