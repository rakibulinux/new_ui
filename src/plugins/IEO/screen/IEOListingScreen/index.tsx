import classNames from 'classnames';
import * as React from 'react';
import { ListItemIEO } from './../../containers';
import { useDispatch, useSelector } from 'react-redux';
import { selectIEOList, IEOListDataFetch } from './../../../../modules';
import Pagination from 'react-bootstrap/Pagination';
export type typeIEO = 'ended' | 'ongoing' | 'upcoming';
export const IEOListingScreen = () => {
	const [typeIEO, setTypeIEO] = React.useState<typeIEO>('ongoing');
	const [searchInputState, setSearchInputState] = React.useState<string>('');
	const [numberPageState, setNumberPageState] = React.useState<number>(0);
	const PAGE_SIZE = 12;
	const handleViewListIEO = (type: typeIEO) => {
		setTypeIEO(type);
		setSearchInputState('');
	};
	const dispatch = useDispatch();
	const renderActiveButtonUpcomingClasses = classNames('upcoming', typeIEO === 'upcoming' ? 'button--upcoming' : '');
	const renderActiveButtonRunningClasses = classNames('running', typeIEO === 'ongoing' ? 'button--running' : '');
	const renderActiveButtonEndedClasses = classNames('ended', typeIEO === 'ended' ? 'button--ended' : '');
	const listIEO = useSelector(selectIEOList);

	React.useEffect(() => {
		dispatch(IEOListDataFetch());
		// dispatchListIEO();
	}, []);

	const listRender = () => {
		if (searchInputState.trim()) {
			return listIEO.payload.filter(
				item => item.currency_id.toLowerCase().includes(searchInputState.toLowerCase().trim()) && item.type === typeIEO,
			);
		} else
			return listIEO.payload
				.filter(item => item.type === typeIEO)
				.slice(PAGE_SIZE * numberPageState, PAGE_SIZE * numberPageState + PAGE_SIZE);
	};
	const listIEOByType = () => {
		return listIEO.payload.filter(item => item.type === typeIEO);
	};

	const renderPagination = () => {
		if (searchInputState.trim()) {
			return null;
		}
		const paginations: Array<JSX.Element> = [];
		for (let i = numberPageState; i < numberPageState + 3 && i * PAGE_SIZE < listIEOByType().length; i++) {
			paginations.push(
				<Pagination.Item
					id={`${numberPageState == i ? 'active' : 'non_active'}`}
					onClick={() => {
						setNumberPageState(i);
					}}
				>
					{i + 1}
				</Pagination.Item>,
			);
		}
		return (
			<Pagination className="d-flex justify-content-end" style={{ padding: '10px' }}>
				<Pagination.Prev
					disabled={numberPageState === 0}
					onClick={() => {
						setNumberPageState(numberPageState - 1);
					}}
				/>
				{paginations}
				<Pagination.Next
					disabled={(numberPageState + 1) * PAGE_SIZE >= listIEOByType().length}
					onClick={() => {
						setNumberPageState(numberPageState + 1);
					}}
				/>
			</Pagination>
		);
	};
	return (
		<div id="ieo-listing-screen">
			<div className="container ieo-listing-screen__header" style={{ paddingLeft: '0px' }}>
				<h3 className="col-12">IEO</h3>
				<div className="ieo-listing-function flex-wrap col-12" style={{ paddingRight: '0px' }}>
					<div className="input-list-function-search" style={{ width: '20rem', height: '45px' }}>
						<input
							name="function-search"
							type="text"
							value={searchInputState}
							placeholder="Search currency"
							onChange={e => {
								setSearchInputState(e.target.value);
							}}
						/>
						<div className="icon-search">
							<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M12.5 11H11.71L11.43 10.73C12.41 9.59 13 8.11 13 6.5C13 2.91 10.09 0 6.5 0C2.91 0 0 2.91 0 6.5C0 10.09 2.91 13 6.5 13C8.11 13 9.59 12.41 10.73 11.43L11 11.71V12.5L16 17.49L17.49 16L12.5 11ZM6.5 11C4.01 11 2 8.99 2 6.5C2 4.01 4.01 2 6.5 2C8.99 2 11 4.01 11 6.5C11 8.99 8.99 11 6.5 11Z"
									fill="#848E9C"
								/>
							</svg>
						</div>
					</div>
					<div className="view-ioe-item-type">
						<button
							type="button"
							className={renderActiveButtonUpcomingClasses}
							onClick={() => {
								handleViewListIEO('upcoming');
							}}
							style={{ borderRadius: ' 3px 0px 0px 3px' }}
						>
							Upcoming
						</button>
						<button
							type="button"
							className={renderActiveButtonRunningClasses}
							onClick={() => {
								handleViewListIEO('ongoing');
							}}
						>
							Ongoing
						</button>
						<button
							type="button"
							className={renderActiveButtonEndedClasses}
							onClick={() => {
								handleViewListIEO('ended');
							}}
							style={{ borderRadius: ' 0px 5px 5px 0px' }}
						>
							Ended
						</button>
					</div>
				</div>
			</div>
			<div className="container" style={{ borderRadius: '10px', boxShadow: ' 0 4px 8px -2px rgb(0 0 0 / 15%)' }}>
				{listIEO.loading ? (
					<div className="loading">
						<div className="spinner-border text-primary" role="status">
							<span className="sr-only">Loading...</span>
						</div>
					</div>
				) : (
					<React.Fragment>
						<ListItemIEO IEOList={listRender()} />
						{renderPagination()}
					</React.Fragment>
				)}
			</div>
		</div>
	);
};
