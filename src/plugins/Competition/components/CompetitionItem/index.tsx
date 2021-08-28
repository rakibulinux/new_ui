import React from 'react';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { currenciesFetch, NewCompetition, selectCurrencies } from '../../../../modules';
import Countdown from 'react-countdown';
import classNames from 'classnames';
// import NP from 'number-precision';
// import millify from 'millify';
export const CompetitionItem: React.FC<NewCompetition> = props => {
	const dispatch = useDispatch();
	const dispatchFetchCurrencies = () => dispatch(currenciesFetch());
	const history = useHistory();
	const competitionTypeClassName = classNames(
		`${props.type === 'trade' ? 'competition-type--trade' : 'competition-type--stake'}`,
	);
	const status = (color: string, type: string) => {
		return (
			<div className="competition-item-coin-time" style={{ backgroundColor: `${color}` }}>
				<p style={{ textTransform: 'uppercase', fontSize: '14px', lineHeight: '16px', margin: 0 }}>{type}</p>
			</div>
		);
	};
	const renderer = ({ days, hours, minutes, seconds, completed }) => {
		return (
			<div className="d-flex justify-content-center" id="countdown-renderer">
				<div className="time">
					<p className="w-100">
						{days}
						<br />
						days
					</p>
				</div>
				<div className="time">
					<p>
						{hours}
						<br /> hours
					</p>
				</div>
				<div className="time">
					<p>
						{minutes} <br /> minutes
					</p>
				</div>
				<div className="time">
					<p>
						{seconds} <br /> seconds
					</p>
				</div>
			</div>
		);
	};
	const renderStatus = (type: 'ended' | 'ongoing' | 'upcoming') => {
		switch (type) {
			case 'ongoing':
				return status(`#2FB67E`, 'Running');
			case 'upcoming':
				return status(` #E06211`, `Upcoming`);
			case 'ended':
				return status(`#BD3421`, 'Ended');
			default:
				return `#ffff`;
		}
	};
	const rendererCountDown = (type: 'ended' | 'ongoing' | 'upcoming') => {
		if (type !== 'upcoming') return <Countdown date={props.end_date} renderer={renderer} />;
		return <Countdown date={props.start_date} renderer={renderer} />;
	};
	const currencies = useSelector(selectCurrencies);
	React.useEffect(() => {
		dispatchFetchCurrencies();
	}, []);
	const getCryptoIcon = (currencyID: string): string => {
		const currency = currencies.find((cur: any) => cur.id === currencyID.toLowerCase());
		try {
			return require(`../../../../../node_modules/cryptocurrency-icons/128/color/${currencyID.toLowerCase()}.png`);
		} catch (err) {
			if (currency) {
				return currency.icon_url;
			}
			return require('../../../../../node_modules/cryptocurrency-icons/svg/color/generic.svg');
		}
	};
	return (
		<div
			id="competition-item"
			onClick={() => {
				const location = {
					pathname: `/trading-competition/${props.id}`,
				};
				history.push(location);
			}}
		>
			<div className="competition-item-header">
				{renderStatus(props.status)}
				<div className={`competition-item-type ${competitionTypeClassName}`}>{`${props.type}`}</div>
				<div className="h-100 d-flex justify-content-center align-items-center">
					<img
						src={getCryptoIcon(props.currency_id.toUpperCase())}
						alt={`${props.currency_id}-icon`}
						style={{ width: '57.87px', height: '57.87px' }}
					/>
				</div>
			</div>

			<div className="competition-item-content">
				<h3>Best Price</h3>
				<h3>{props.total_prize?.toUpperCase()}</h3>
				{rendererCountDown(props.status)}
				<div className="competition-item-currencies d-flex flex-row flex-wrap">
					<div className="competition-item-currency">
						<p>{props.currency_id}</p>
					</div>
				</div>
			</div>

			<div className="competition-item-footer">
				<button className="competition-item-footer-status col-6">{`Start`}</button>
				<p className="competition-item-footer-bonus col-6">{`Learn More`}</p>
			</div>
		</div>
	);
};
