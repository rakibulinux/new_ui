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
