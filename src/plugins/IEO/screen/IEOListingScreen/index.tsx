import classNames from 'classnames';
import * as React from 'react';
import { ListItemIEO } from './../../containers';
import { useDispatch, useSelector } from 'react-redux';
import { selectIEOList, IEOListDataFetch } from './../../../../modules';
export type typeIEO = 'ended' | 'ongoing' | 'upcoming';
export const IEOListingScreen = () => {
	const [typeIEO, setTypeIEO] = React.useState<typeIEO>('ongoing');
	const [searchInputState, setSearchInputState] = React.useState<string>('');

	const handleViewListIEO = (type: typeIEO) => {
		setTypeIEO(type);
	};
	const dispatch = useDispatch();

	const renderActiveButtonUpcomingClasses = classNames('upcoming', typeIEO === 'upcoming' ? 'button-active' : '');
	const renderActiveButtonRunningClasses = classNames('running', typeIEO === 'ongoing' ? 'button-active' : '');
	const renderActiveButtonEndedClasses = classNames('ended', typeIEO === 'ended' ? 'button-active' : '');
	const listIEO = useSelector(selectIEOList);

	React.useEffect(() => {
		dispatch(IEOListDataFetch());
		// dispatchListIEO();
	}, []);

	return (
		<div id="ieo-listing-screen">
			<div className="ieo-listing-screen__header" style={{ paddingLeft: '5px' }}>
				<h3 style={{ marginBottom: '50px' }}>IEO</h3>
				<div className="ieo-listing-function flex-wrap">
					<div className="input-list-function-search" style={{ width: '190px', height: '46px' }}>
						<input
							name="function-search"
							type="text"
							placeholder="search IEO"
							value={searchInputState}
							onChange={e => {
								setSearchInputState(e.target.value);
							}}
						/>
						<div className="icon-search">
							<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M12.5 11H11.71L11.43 10.73C12.41 9.59 13 8.11 13 6.5C13 2.91 10.09 0 6.5 0C2.91 0 0 2.91 0 6.5C0 10.09 2.91 13 6.5 13C8.11 13 9.59 12.41 10.73 11.43L11 11.71V12.5L16 17.49L17.49 16L12.5 11ZM6.5 11C4.01 11 2 8.99 2 6.5C2 4.01 4.01 2 6.5 2C8.99 2 11 4.01 11 6.5C11 8.99 8.99 11 6.5 11Z"
									fill="#707A8A"
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
						>
							Ended
						</button>
					</div>
				</div>
			</div>
			<div className="container-full">
				{listIEO.loading ? (
					<div className="loading">
						<div className="spinner-border text-primary" role="status">
							<span className="sr-only">Loading...</span>
						</div>
					</div>
				) : (
					<ListItemIEO
						IEOList={[
							...listIEO.payload.filter(
								item =>
									item.currency_id.toLowerCase().includes(searchInputState.toLowerCase().trim()) &&
									item.type === typeIEO,
							),
						]}
					/>
				)}
			</div>
		</div>
	);
};
