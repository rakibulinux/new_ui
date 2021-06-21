import * as React from 'react';

export const IEODetailScreen = () => {
	// const listCoins = ['prob', 'xrp', 'btc', 'eth', 'xrp'];
	return (
		<div id="ieo-detail-screen">
			<h3>IEO</h3>
			<button id="ioe-detail-screen__return-list">Return to Lists</button>
			<div id="ioe-detail-screen_container row">
				<div className="ieo-info col-6"></div>
				<div className="ieo-buy col-6"></div>
			</div>
		</div>
	);
};
