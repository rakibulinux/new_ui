import Countdown from 'react-countdown';
import { format } from 'date-fns';
import React from 'react';
import { useHistory } from 'react-router';
import { LoadingCompetition } from 'plugins/Competition/components';
import classNames from 'classnames';

interface CompetitionInfoProps {
	currency_id: string;
	start_date: string;
	end_date: string;
	type: 'trade' | 'stake';
	markets: string[];
	volume: number;
	next_update: string;
	loading: boolean;
	status: 'ongoing' | 'ended' | 'upcoming';
}
export const CompetitionInfo = (props: CompetitionInfoProps) => {
	const { currency_id, start_date, end_date, type, markets, volume, next_update, loading, status } = props;
	const [marketIDState, setMarketIDState] = React.useState('');
	const [infoTimeState, setInfoTimeState] = React.useState({
		start_date: new Date(),
		next_update: new Date(),
		end_date: new Date(),
	});

	React.useEffect(() => {
		if (start_date && next_update && end_date)
			setInfoTimeState({
				start_date: new Date(start_date),
				end_date: new Date(end_date),
				next_update: new Date(next_update),
			});
	}, [start_date, end_date, type, next_update, loading, status]);
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
			return <p className="time">00 : 00</p>;
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

	const loadingDetailsClassNames = classNames('align-item-center', 'competition-background-loading');
	return (
		<div
			className={`competition-ranking-detail d-flex flex-column justify-content-center ${
				loading ? loadingDetailsClassNames : ''
			}`}
		>
			{loading ? <LoadingCompetition className="competition-ranking-detail__loading position-absolute" /> : ''}

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
				<div className="col-md-8 col-lg-6 row">
					<div className="col-md-6">
						{renderInfoItem('Your Trade volume', <p>{volume.toFixed(4)}</p>)}
						{renderInfoItem('Next Update', <Countdown renderer={renderer} date={infoTimeState.next_update} />)}
					</div>
					<div className="col-md-6">
						{renderInfoItem('Start Time', <p>{format(infoTimeState.start_date, 'yyyy-MM-dd hh:mm')}</p>)}
						{renderInfoItem('End Time', <p>{format(infoTimeState.end_date, 'yyyy-MM-dd hh:mm')}</p>)}
					</div>
				</div>
				<div className="col-md-4 col-lg-6 d-flex flex-column justify-content-center">
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
						{type === 'trade' ? (
							markets.map((market, index) => (
								<option key={index} value={market}>
									{market}
								</option>
							))
						) : (
							<option>{currency_id.toUpperCase()}</option>
						)}
						`
					</select>
					<div className="d-flex justify-content-center">
						<button
							className="competition-ranking-detail__info__button competition-ranking-detail__info__button--disable"
							onClick={handleLetJoin}
							disabled={status !== 'ongoing'}
						>{`Let's ${uppercaseCharacterFirst(type)}`}</button>
					</div>
				</div>
			</div>
		</div>
	);
};
