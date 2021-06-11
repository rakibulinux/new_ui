import classNames from 'classnames';
import * as React from 'react';
import { ListItemIEO } from './../../containers';

export type typeIEO = 'all' | 'running' | 'upcoming';
export const IEOListingScreen = () => {
	const [typeIEO, setTypeIEO] = React.useState<typeIEO>('all');
	const handleViewListIEO = (type: typeIEO) => {
		setTypeIEO(type);
	};
	const renderActiveButtonUpcomingClasses = classNames('upcoming', typeIEO === 'upcoming' ? 'button-active' : '');
	const renderActiveButtonRunningClasses = classNames('running', typeIEO === 'running' ? 'button-active' : '');
	const renderActiveButtonAllClasses = classNames('all', typeIEO === 'all' ? 'button-active' : '');
	return (
		<div id="ieo-listing-screen">
			<div className="ieo-listing-screen__header">
				<h3>IEO</h3>
				<label htmlFor="function-search" className="header-label">
					IEO History
				</label>
				{/* <FiSearch /> */}

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
								handleViewListIEO('running');
							}}
						>
							Running
						</button>
						<button
							type="button"
							className={renderActiveButtonAllClasses}
							onClick={() => {
								handleViewListIEO('all');
							}}
						>
							All
						</button>
					</div>
				</div>
				{/* <input type="checkbox">Show Only Launchpads</input> */}
			</div>
			<ListItemIEO type={typeIEO} />
		</div>
	);
};
