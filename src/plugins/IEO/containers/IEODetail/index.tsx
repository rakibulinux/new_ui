import React from 'react';
import MaskGroup from './assets/MaskGroup.png';

interface IEODetailProps {
	imageLink: string;
	startDate: string;
	endDate: string;
	bonus: string;
	currencyID: string;
}

export const IEODetail: React.FC<IEODetailProps> = props => {
	const formatDate = date => {
		return new Date(date).toString().split(' ').slice(0, 5).join(' ');
	};
	return (
		<div id="ieo-detail" style={{ backgroundImage: `url(${MaskGroup})` }}>
			<div className="content col-11 m-auto">
				<div id="ieo-detail-header"></div>
				<div id="ieo-detail-body" className="col-12">
					<img className="logo-icon" src={props.imageLink} alt="image coin"></img>
					<p id="ieo-detail-body-time">{`${formatDate(props.startDate)} ~ ${formatDate(props.endDate)}`}</p>
				</div>
				<hr></hr>
				<div id="ieo-detail-footer">
					<p>{`${props.bonus}% Bonus ${props.currencyID}`}</p>
				</div>
			</div>
		</div>
	);
};
