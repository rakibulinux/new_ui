import { Col, Progress, Row, Statistic } from 'antd';
import * as React from 'react';
import Countdown from 'react-countdown';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { currenciesFetch, SaleItem, selectCurrencies } from '../../../../modules';
import './IEOItem.css';
interface SaleItemProps {
	key: string | number | undefined;
	sale: SaleItem;
	type: 'ongoing' | 'upcoming' | 'ended';
}

const renderer = ({ days, hours, minutes, seconds, completed }) => {
	if (completed) {
		// render a completed state
		// window.location.reload(false);
		return (
			<div id="sale_item__timer">
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
			<div id="sale_item__timer">
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

export const IEOItem: React.FC<SaleItemProps> = (props: SaleItemProps) => {
	const history = useHistory();

	const dispatch = useDispatch();
	const dispatchcFetchCurrencies = React.useCallback(() => dispatch(currenciesFetch()), [dispatch]);

	React.useEffect(() => {
		dispatchcFetchCurrencies();
	}, [dispatchcFetchCurrencies]);
	const currencies = useSelector(selectCurrencies);
	let saleBadgeColor = '#0C9D58ff';
	switch (props.type) {
		case 'ongoing':
			saleBadgeColor = '#0C9D58ff';
			break;
		case 'upcoming':
			saleBadgeColor = '#FABE08ff';
			break;
		case 'ended':
			saleBadgeColor = '#EA4235ff';
			break;
		default:
			break;
	}

	const countdownTime = props.type === 'upcoming' ? new Date(props.sale.start_date) : new Date(props.sale.end_date);
	let countdownTitle: JSX.Element;

	switch (props.type) {
		case 'upcoming':
			countdownTitle = <span className="text-success">START IN</span>;
			break;
		case 'ongoing':
			countdownTitle = <span className="text-warning">END IN</span>;
			break;
		default:
			countdownTitle = <span className="text-danger">ENDED</span>;
			break;
	}

	const saleType = props.type ? props.type.toUpperCase() : 'Unavailable';

	const findIcon = (code: string): string => {
		const currency = currencies.find(currencyParam => currencyParam.id === code);
		try {
			return require(`../../../../../node_modules/cryptocurrency-icons/128/color/${code.toLowerCase()}.png`);
		} catch (err) {
			if (currency) {
				return currency.icon_url;
			}

			return require('../../../../../node_modules/cryptocurrency-icons/svg/color/generic.svg');
		}
	};
	const handleDetailClick = () => {
		const location = {
			pathname: `/sale/${props.sale.id}`,
		};
		history.push(location);
	};

	return (
		<div className="sale-item" onClick={handleDetailClick}>
			<span className="sale-item__badge" style={{ backgroundColor: saleBadgeColor }}>
				{saleType}
			</span>
			<div className="row">
				<div className="col-6">
					<h3 className="sale-item__title">{props.sale.currency_id.toUpperCase()}</h3>
					<span className="sale-item__subtitle">{props.sale.description}</span>
				</div>
				<div className="col-6">
					<img className="img-fluid" src={props.sale.image_link} alt="" />
				</div>
			</div>
			<br />
			<div className="row">
				<div className="col-12 text-center">
					<h4 className="text-bold">{countdownTitle}</h4>
				</div>
			</div>
			<div className="row">
				<div className="col-12 d-flex justify-content-center">
					<Countdown date={countdownTime} renderer={renderer} />
				</div>
			</div>
			<br />
			<div className="row">
				<div className="col-12 text-center" style={{ padding: '0 5rem' }}>
					<Statistic title="Remain Tokens" value={`${props.sale.remains}/${props.sale.total_ieo}`} />

					<Progress
						strokeColor={{
							'0%': '#2a9d8f',
							'100%': '#e76f51',
						}}
						status="active"
						percent={Math.floor(((props.sale.total_ieo - props.sale.remains) / props.sale.total_ieo) * 100)}
					/>
				</div>
			</div>
			<br />
			<div className="row">
				<div className="col-6 d-flex align-items-center justify-content-center">
					<Statistic title="STARTING PRICE:" value={`$${props.sale.price} USD`} />
				</div>
				<div className="col-6 d-flex align-items-center justify-content-center">
					<Row gutter={[8, 8]}>
						{props.sale.currency_available.map(currency => (
							<Col span={8}>
								<img
									style={{ width: '3rem', height: '3rem', marginLeft: '1rem', marginTop: '1rem' }}
									src={findIcon(currency)}
									alt=""
								/>
							</Col>
						))}
					</Row>
				</div>
			</div>
		</div>
	);
};
