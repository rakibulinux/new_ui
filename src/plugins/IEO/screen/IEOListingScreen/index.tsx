import classNames from 'classnames';
import * as React from 'react';
import { ListItemIEO } from './../../containers';
import { useDispatch, useSelector } from 'react-redux';
import {
	selectSaleList,
	activeSaleListFetch,
	upComingSaleListFetch,
	onGoingSaleListFetch,
	endedSaleListFetch,
} from './../../../../modules';
export type typeIEO = 'ended' | 'ongoing' | 'upcoming';
export const IEOListingScreen = () => {
	const [typeIEO, setTypeIEO] = React.useState<typeIEO>('ongoing');
	const [searchInputState, setSearchInputState] = React.useState<string>('');
	const handleViewListIEO = (type: typeIEO) => {
		setTypeIEO(type);
		switch (type) {
			case 'upcoming':
				dispatchUpcomingSaleListFetch();
				break;
			case 'ongoing':
				dispatchOnGoingSaleListFetch();
				break;
			case 'ended':
				dispatchEndedSaleListFetch();
		}
	};
	const dispatch = useDispatch();
	const dispatchActiveSaleListFetch = () => dispatch(activeSaleListFetch());
	const dispatchUpcomingSaleListFetch = () => dispatch(upComingSaleListFetch());
	const dispatchOnGoingSaleListFetch = () => dispatch(onGoingSaleListFetch());
	const dispatchEndedSaleListFetch = () => dispatch(endedSaleListFetch());
	const renderActiveButtonUpcomingClasses = classNames('upcoming', typeIEO === 'upcoming' ? 'button-active' : '');
	const renderActiveButtonRunningClasses = classNames('running', typeIEO === 'ongoing' ? 'button-active' : '');
	const renderActiveButtonEndedClasses = classNames('ended', typeIEO === 'ended' ? 'button-active' : '');
	const saleList = useSelector(selectSaleList);
	React.useEffect(() => {
		dispatchActiveSaleListFetch();
	}, []);

	return (
		<div id="ieo-listing-screen">
			<div className="ieo-listing-screen__header">
				<h3>IEO</h3>
				<div className="ieo-listing-function">
					<input
						name="function-search"
						type="text"
						className="input-list-function-search"
						placeholder="search IEO"
						value={searchInputState}
						onChange={e => {
							setSearchInputState(e.target.value);
						}}
					/>
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
							OnGoing
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
				{saleList.loading ? (
					<div className="loading">
						<div className="spinner-border text-primary" role="status">
							<span className="sr-only">Loading...</span>
						</div>
					</div>
				) : (
					<ListItemIEO
						IEOList={[
							...saleList.payload.filter(item =>
								item.currency_id.toLowerCase().includes(searchInputState.toLowerCase()),
							),
						]}
					/>
				)}
			</div>
		</div>
	);
};
