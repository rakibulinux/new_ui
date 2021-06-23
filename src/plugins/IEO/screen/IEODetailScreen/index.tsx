import * as React from 'react';
import { IEODetail, BuyIEO } from './../../containers';

export const IEODetailScreen = () => {
	const coins = ['PROB', 'XRP', 'BTC', 'ETH', 'XRP'];
	return (
		<div id="ieo-detail-screen">
			<h3>IEO</h3>
			<button id="ioe-detail-screen__return-list">Return to Lists</button>
			<div id="ieo-detail-screen_container" className="col-md-12 d-flex justify-content-center">
				<div className="col-5" style={{ height: '591px' }}>
					<IEODetail />
				</div>
				<div className="col-5" style={{ backgroundColor: '#434A56', height: '591px' }}>
					<BuyIEO coins={coins} />
				</div>
			</div>
		</div>
	);
};
