import React from 'react';
import LK from './assets/lK.png';
import MaskGroup from './assets/MaskGroup.png';
export const IEODetail = () => {
	return (
		<div id="ieo-detail" style={{ backgroundImage: MaskGroup }}>
			<div className="content col-11 m-auto">
				<div id="ieo-detail-header">
					<div id="ieo-detail-header-distance-start">
						<p>2nd</p>
					</div>
					<div id="ieo-detail-header-listing-on">
						<p>Listing on May 14</p>
					</div>
				</div>
				<div id="ieo-detail-body" className="col-12">
					<img className="logo-icon" src={LK}></img>
					<p id="ieo-detail-body-time">2021-05-06 16:00 ~ 2021-05-12 13:00 (GMT+7)</p>
				</div>
				<hr></hr>
				<div id="ieo-detail-footer">
					<p>2% Bonus : PROB</p>
				</div>
			</div>
		</div>
	);
};
