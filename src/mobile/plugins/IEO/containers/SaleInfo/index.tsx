import * as React from 'react';
import { ProgressBar } from 'react-bootstrap';
import Countdown from 'react-countdown';
import './SaleInfo.css';

import { Col, Row, Statistic } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getTotalBuyers, SaleItem, selectTotalBuyers } from '../../../../../modules';

interface SaleInfoProps {
	ieoID: string;
	sale: SaleItem;
}

const renderer = ({ days, hours, minutes, seconds, completed }) => {
	if (completed) {
		// render a completed state
		return (
			<div id="ieo-item-mobile__timer">
				<div id="days">
					00 <span>Days</span>
				</div>
				<div id="hours">
					00 <span>Hours</span>
				</div>
				<div id="minutes">
					00 <span>Mininutes</span>
				</div>
				<div id="seconds">
					00 <span>Seconds</span>
				</div>
			</div>
		);
	} else {
		// render a countdown
		return (
			<div id="ieo-item-mobile__timer">
				<div id="days">
					{days} <span>Days</span>
				</div>
				<div id="hours">
					{hours} <span>Hours</span>
				</div>
				<div id="minutes">
					{minutes} <span>Mininutes</span>
				</div>
				<div id="seconds">
					{seconds} <span>Seconds</span>
				</div>
			</div>
		);
	}
};

export const SaleInfo: React.FC<SaleInfoProps> = (props: SaleInfoProps) => {
	const countdownTime = props.sale.type === 'upcoming' ? new Date(props.sale.start_date) : new Date(props.sale.end_date);

	const dispatch = useDispatch();
	const dispatchGetTotalBuyers = ieoID =>
		dispatch(
			getTotalBuyers({
				ieo_id: ieoID,
			}),
		);

	const totalBuyersSelector = useSelector(selectTotalBuyers);

	React.useEffect(() => {
		dispatchGetTotalBuyers(props.ieoID);
	}, []);

	return (
		<div id="ieo-info-mobile" style={{ backgroundColor: '#1c3049', padding: '3vw', height: '100%' }}>
			<div className="row">
				<div className="col-12">
					<img className="w-50" src={props.sale.image_link} alt="sale-logo" />
				</div>
			</div>
			<div className="row">
				<div className="col-12">
					<h4 className="ieo-info-mobile__title">{props.sale.description}</h4>
				</div>
			</div>
			<div className="row d-flex justify-content-center">
				<Countdown date={countdownTime} renderer={renderer} />
			</div>
			<hr />
			<div className="row text-center">
				<div className="col-12">
					<Row gutter={[16, 16]}>
						<Col span={12}>
							<Statistic valueStyle={{ color: '#e9c46a' }} title="Start Price" value={`$${props.sale.price} USD`} />
						</Col>
						<Col span={12}>
							<Statistic
								valueStyle={{ color: '#e76f51' }}
								title="Min Buy"
								value={`${props.sale.min_buy} ${props.sale.currency_id.toUpperCase()}`}
							/>
						</Col>
						<Col span={24}>
							<Statistic
								valueStyle={{ color: '#f4a261' }}
								title="Available Currencies"
								value={props.sale.currency_available.map(currency => currency.toUpperCase()).join(', ')}
							/>
						</Col>
					</Row>
				</div>
			</div>
			<hr />
			<div className="row">
				<div className="col-12 text-center">
					<Row gutter={[16, 16]}>
						<Col span={24}>
							<Statistic valueStyle={{ color: '#e9c46a' }} title={'Remain'} value={props.sale.remains} />
						</Col>
						<Col span={24}>
							<Statistic valueStyle={{ color: '#f4a261' }} title={'Total'} value={props.sale.total_ieo} />
						</Col>
						<Col span={24}>
							<Statistic
								valueStyle={{ color: '#e76f51', fontWeight: 'bold' }}
								title="Total Buyers"
								value={totalBuyersSelector.payload.totalBuyers}
							/>
						</Col>
					</Row>
					<hr />
					<ProgressBar
						animated
						variant="info"
						now={((props.sale.total_ieo - props.sale.remains) / props.sale.total_ieo) * 100}
						label=""
						style={{ height: '40px', fontSize: '1rem', fontWeight: 'bold' }}
					/>
				</div>
			</div>
		</div>
	);
};
