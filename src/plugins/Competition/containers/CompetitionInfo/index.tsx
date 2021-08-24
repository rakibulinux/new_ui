import Countdown from 'react-countdown';
import { format } from 'date-fns';
import moment from 'moment';
import React from 'react';
import { useHistory } from 'react-router';

interface CompetitionInfoProps {
	currency_id: string;
	start_date: string;
	end_date: string;
	type: 'trade' | 'stake';
	markets: string[];
	volume: number;
	next_update: string;
}
export const CompetitionInfo = (props: CompetitionInfoProps) => {
	const { currency_id, start_date, end_date, type, markets, volume, next_update } = props;
	const [marketIDState, setMarketIDState] = React.useState('');
	const history = useHistory();
	const handleLetJoin = () => {
		if (!marketIDState) {
			return;
		}
		if (type === 'stake') {
			const location = {
				pathname: '/stake',
			};
			history.push(location);
		} else {
			const market = marketIDState.replace('/', '');
			const location = {
				pathname: `/marker/${market}`,
			};
			history.push(location);
		}
	};
	const renderer = ({ days, hours, minutes, seconds, completed }) => {
		if (completed) {
			// render a completed state
			return <p className="ant-statistic-content">00 : 00</p>;
		} else {
			// render a countdown
			return (
				<p>
					{minutes < 10 ? 0 : ''}
					{minutes} : {seconds < 10 ? 0 : ''}
					{seconds}
				</p>
			);
		}
	};
	const uppercaseCharacterFirst = (str: string) => {
		return str.charAt(0).toUpperCase() + str.slice(1);
	};
	const renderInfoItem = (key: string, value: JSX.Element) => (
		<div className="competition-ranking-detail__info__update">
			<div className="competition-ranking-detail__info__update__title">
				<p>{key}</p>
			</div>
			<div className="competition-ranking-detail__info__update__value">
				<p>{value}</p>
			</div>
		</div>
	);
	return (
		<div className="competition-ranking-detail d-flex flex-column justify-content-center">
			<div className="competition-ranking-detail__title text-center">
				<h4>Become a winner and get a prize</h4>
			</div>
			<div className="competition-ranking-detail__description text-center m-auto">
				<p>
					{`${uppercaseCharacterFirst(
						type,
					)} ${currency_id.toUpperCase()} and win. The one who ${type} the largest volume will receive the main prize! ${
						type === 'trade'
							? `Condition: buy or sell  ${currency_id.toUpperCase()}!`
							: `Stake ${currency_id.toUpperCase()}`
					}`}
				</p>
			</div>
			<div className="competition-ranking-detail__info d-flex flex-wrap">
				<div className="col-md-6 row">
					<div className="col-md-6">
						{renderInfoItem('Your Trade volume', <p>{volume.toFixed(4)}</p>)}
						{renderInfoItem('Next Update', <Countdown renderer={renderer} date={new Date(next_update)} />)}
					</div>
					<div className="col-md-6">
						{renderInfoItem('Start Time', <p>{format(moment(start_date).toDate(), 'yyyy-MM-dd hh:mm')}</p>)}
						{renderInfoItem('End Time', <p>{format(moment(end_date).toDate(), 'yyyy-MM-dd hh:mm')}</p>)}
					</div>
				</div>
				<div className="col-md-6 d-flex flex-column justify-content-center">
					<select
						className="competition-ranking-detail__info__selection"
						onChange={e => {
							setMarketIDState(e.target.value);
						}}
					>
						<option value={''} selected>
							{uppercaseCharacterFirst(type)}
						</option>
						`
						{markets.map((market, index) => (
							<option key={index} value={market}>
								{market}
							</option>
						))}
						`
					</select>
					<div className="d-flex justify-content-center">
						<button
							className="competition-ranking-detail__info__forward"
							onClick={handleLetJoin}
						>{`Let's ${uppercaseCharacterFirst(type)}`}</button>
					</div>
				</div>
			</div>
		</div>
	);
};
