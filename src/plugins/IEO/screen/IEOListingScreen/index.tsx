import * as React from 'react';
import { ListItemIEO } from './../../containers';

export const IEOListingScreen = () => {
	const [typeIEO, settypeIEO] = React.useState('all');
	const handleViewListIEO = (type: string) => {
		settypeIEO(type);
		document.querySelector('.button-active')?.classList.remove('button-active');
		document.querySelector(`.${type}`)?.classList.add('button-active');
	};

	return (
		<div id="ieo-listing-screen">
			<div className="ioe-listing-screen-header">
				<h3>IEO</h3>
				<label htmlFor="function-search" className="header-label">
					IEO History
				</label>
				{/* <FiSearch /> */}

				<div className="ioe-listing-function">
					<input name="function-search" type="text" className="input-list-function-search"></input>
					<div className="view-ioe-item-type">
						<button
							type="button"
							className="upcoming"
							onClick={() => {
								handleViewListIEO('upcoming');
							}}
						>
							Upcoming
						</button>
						<button
							type="button"
							className="running"
							onClick={() => {
								handleViewListIEO('running');
							}}
						>
							Running
						</button>
						<button
							type="button"
							className="button-active all"
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
