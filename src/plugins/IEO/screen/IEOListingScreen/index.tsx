import classNames from 'classnames';
import * as React from 'react';
import { ListItemIEO } from './../../containers';

export type typeIEO = 'ended' | 'ongoing' | 'upcoming';
export const IEOListingScreen = () => {
	const [typeIEO, setTypeIEO] = React.useState<typeIEO>('ongoing');
	const handleViewListIEO = (type: typeIEO) => {
		setTypeIEO(type);
	};
	const renderActiveButtonUpcomingClasses = classNames('upcoming', typeIEO === 'upcoming' ? 'button-active' : '');
	const renderActiveButtonRunningClasses = classNames('running', typeIEO === 'ongoing' ? 'button-active' : '');
	const renderActiveButtonEndedClasses = classNames('ended', typeIEO === 'ended' ? 'button-active' : '');
	return (
		<div id="ieo-listing-screen">
			<div className="ieo-listing-screen__header">
				<h3>IEO</h3>
				<label htmlFor="function-search" className="header-label">
					IEO History
				</label>

				<div className="ieo-listing-function">
					<input name="function-search" type="text" className="input-list-function-search"></input>
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
			<ListItemIEO type={typeIEO} />
		</div>
	);
};
